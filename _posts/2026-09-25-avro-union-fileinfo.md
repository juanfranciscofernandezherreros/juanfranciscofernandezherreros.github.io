---
layout: "article"
title: "Avro unions: why FileInfo changes its JSON representation"
description: "A practical example showing why making FileInfo optional creates an Avro union and can expose the record's fully qualified name in JSON."
permalink: "/java-spring/avro-union-fileinfo/"
lang: "en"
lang_url: "/java-spring/avro-union-fileinfo/es/"
categories: ["Java & Spring"]
subcategories: ["Event Streaming"]
tags: ["java","kafka","avro","schema","union","json","schema-registry"]
date: "2026-09-25"
reading_minutes: 6
published: true
---

# Avro unions: why `FileInfo` changes its JSON representation

A very small change in an Avro schema can produce a visible change in JSON. That is exactly what happens when a field moves from required to optional.

The concrete case is this:

```avro
FileInfo fileInfo;
```

becoming:

```avro
FileInfo? fileInfo = null;
```

Visually, we only added `?` and `= null`. For Avro, however, the field type has changed. That change explains why some JSON representations suddenly include the record's fully qualified name.

## The initial case: required `FileInfo`

Consider this protocol:

```avro
@namespace("com.fernandez.topic.item")
protocol ItemProtocol {

    record ItemCommand {
        string? itemId = null;
        string? itemType = null;
        string? command = null;
        string? itemDate = null;
        timestamp_ms? creationTimestamp = null;
        FileInfo fileInfo;
        string? endDate = null;
        string? mode = null;
        string? period = null;
        string? startDate = null;
        int? year = null;
    }

    record FileInfo {
        string fileName;
        string fileUrl;
        string? version = null;
        int? numberRecords = 0;
        timestamp_ms? creationTimestamp = null;
    }
}
```

The important line is:

```avro
FileInfo fileInfo;
```

Here, `fileInfo` has exactly one possible type: `FileInfo`.

A useful mental model is:

```text
fileInfo -> FileInfo
```

The field cannot be `null`. An `ItemCommand` must contain a value compatible with the `FileInfo` record.

That is why the JSON representation can be direct:

```json
{
  "fileInfo": {
    "creationTimestamp": null,
    "fileName": "",
    "fileUrl": "",
    "numberRecords": 0,
    "version": null
  }
}
```

Avro does not need to say which type is inside `fileInfo`, because the schema already tells us that it can only be `FileInfo`.

## The change: making `fileInfo` optional

Now we change the definition to:

```avro
FileInfo? fileInfo = null;
```

The intention is simple: allow `fileInfo` to be absent.

In Avro this is not modeled as “the same type with an optional flag”. It is modeled as a **union**.

Conceptually, the field now becomes:

```text
fileInfo -> null | FileInfo
```

The value can therefore be one of two alternatives:

```text
null
FileInfo
```

That is the key point.

Before, the field had a single type:

```text
FileInfo
```

After the change, it has a union:

```text
null | FileInfo
```

## What does a union mean here?

An Avro union means that a value may belong to one of several possible types.

In this example, `FileInfo?` is a convenient nullable form. Conceptually it is equivalent to something like:

```json
[
  "null",
  "com.fernandez.topic.item.FileInfo"
]
```

When the value is `null`, there is no ambiguity about which union branch is being used:

```json
{
  "fileInfo": null
}
```

When the field contains an object, however, Avro may need to state explicitly that the selected branch is `FileInfo`.

That produces the representation that often looks strange the first time you see it:

```json
{
  "fileInfo": {
    "com.fernandez.topic.item.FileInfo": {
      "creationTimestamp": null,
      "fileName": "",
      "fileUrl": "",
      "numberRecords": 0,
      "version": null
    }
  }
}
```

The inner object is still exactly the same `FileInfo`.

The new part:

```text
com.fernandez.topic.item.FileInfo
```

identifies which branch of the union contains the value.

## Where does `com.fernandez.topic.item.FileInfo` come from?

It comes directly from the namespace:

```avro
@namespace("com.fernandez.topic.item")
```

and the record declaration:

```avro
record FileInfo {
    ...
}
```

The short name is:

```text
FileInfo
```

and the fully qualified name is:

```text
com.fernandez.topic.item.FileInfo
```

This is similar to a Java package.

For example:

```java
package com.fernandez.topic.item;

class FileInfo {
}
```

The fully qualified Java class name would be:

```text
com.fernandez.topic.item.FileInfo
```

Avro records are named types, so the namespace is part of their identity.

## Side-by-side comparison

The difference is easiest to understand when both cases are shown together.

### Without a union

Schema:

```avro
FileInfo fileInfo;
```

Mental model:

```text
fileInfo -> FileInfo
```

Representation:

```json
{
  "fileInfo": {
    "fileName": "",
    "fileUrl": "",
    "version": null,
    "numberRecords": 0,
    "creationTimestamp": null
  }
}
```

### With a union

Schema:

```avro
FileInfo? fileInfo = null;
```

Mental model:

```text
fileInfo -> null | FileInfo
```

An explicit union representation can look like this:

```json
{
  "fileInfo": {
    "com.fernandez.topic.item.FileInfo": {
      "fileName": "",
      "fileUrl": "",
      "version": null,
      "numberRecords": 0,
      "creationTimestamp": null
    }
  }
}
```

The `FileInfo` record itself has not changed.

What changed is the **type of `ItemCommand.fileInfo`**.

## Why can it now appear without the wrapper again?

Sometimes the message may be displayed like this again:

```json
{
  "fileInfo": {
    "creationTimestamp": null,
    "fileName": "",
    "fileUrl": "",
    "numberRecords": 0,
    "version": null
  }
}
```

even if the schema still contains:

```avro
FileInfo? fileInfo = null;
```

That does not necessarily mean the union disappeared.

It is important to separate:

```text
Avro schema
JSON representation produced by a serializer or tool
```

The schema may still be:

```text
null | FileInfo
```

while a library, Kafka UI, mapper or serialization layer decides to display the value without the explicit type wrapper.

So when the JSON shape changes, the first question should be whether the schema actually changed or only the way the Avro value is being converted or displayed.

## The idea to remember

The whole case comes down to this:

```avro
FileInfo fileInfo;
```

versus:

```avro
FileInfo? fileInfo = null;
```

The first means:

```text
There is always a FileInfo.
```

The second means:

```text
The value may be null or FileInfo.
```

In Avro, that is a **union**.

When a JSON representation needs to make the selected branch explicit, it may show:

```text
com.fernandez.topic.item.FileInfo
```

The namespace has not become a new business field. It simply identifies the `FileInfo` type inside the union.

That is why such a small schema change can produce such a visible difference in JSON.
