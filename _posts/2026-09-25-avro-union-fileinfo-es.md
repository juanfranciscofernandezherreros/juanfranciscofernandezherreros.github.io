---
layout: "article"
title: "Union en Avro: por qué cambia la representación JSON de FileInfo"
description: "Un caso práctico para entender por qué convertir FileInfo en opcional crea una union de Avro y puede hacer aparecer el nombre completo del tipo en JSON."
permalink: "/java-spring/avro-union-fileinfo/es/"
lang: "es"
lang_url: "/java-spring/avro-union-fileinfo/"
categories: ["Java & Spring"]
subcategories: ["Event Streaming"]
tags: ["java","kafka","avro","schema","union","json","schema-registry"]
date: "2026-09-25"
reading_minutes: 6
published: true
---

# Union en Avro: por qué cambia la representación JSON de `FileInfo`

Un cambio aparentemente pequeño en un schema Avro puede producir un cambio visible en el JSON. Eso es exactamente lo que ocurre cuando un campo pasa de ser obligatorio a opcional.

El caso concreto es este:

```avro
FileInfo fileInfo;
```

pasa a ser:

```avro
FileInfo? fileInfo = null;
```

Aunque visualmente solo hemos añadido `?` y `= null`, para Avro el tipo del campo ha cambiado. Y ese cambio explica por qué en algunas representaciones JSON aparece el nombre completo del record.

## El caso inicial: `FileInfo` obligatorio

Partimos de un protocolo como este:

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

La línea importante es:

```avro
FileInfo fileInfo;
```

Aquí `fileInfo` tiene un único tipo posible: `FileInfo`.

Podemos imaginarlo así:

```text
fileInfo -> FileInfo
```

El campo no puede ser `null`. Si existe un `ItemCommand`, ese campo debe contener un valor compatible con el record `FileInfo`.

Por eso una representación JSON puede ser directa:

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

Avro no necesita indicar qué tipo hay dentro de `fileInfo`, porque el schema ya establece que solo puede ser `FileInfo`.

## El cambio: hacer `fileInfo` opcional

Ahora cambiamos la definición a:

```avro
FileInfo? fileInfo = null;
```

El objetivo es sencillo: permitir que `fileInfo` pueda no estar informado.

Pero en Avro esto no se modela como «el mismo tipo con una marca de opcionalidad». Se modela mediante una **union**.

Conceptualmente, el tipo pasa a ser:

```text
fileInfo -> null | FileInfo
```

Es decir, el campo puede contener una de estas dos alternativas:

```text
null
FileInfo
```

Ese es el punto clave del caso.

Antes teníamos un único tipo:

```text
FileInfo
```

Después tenemos una union:

```text
null | FileInfo
```

## ¿Qué es una union en este caso?

Una union en Avro significa que un valor puede pertenecer a uno entre varios tipos posibles.

En nuestro ejemplo, `FileInfo?` es una forma cómoda de expresar una union nullable.

Conceptualmente equivale a algo como:

```json
[
  "null",
  "com.fernandez.topic.item.FileInfo"
]
```

Por tanto, cuando el valor es `null`, no hay duda sobre qué rama de la union se está utilizando:

```json
{
  "fileInfo": null
}
```

Pero cuando contiene un objeto, Avro puede necesitar indicar explícitamente que la rama seleccionada es `FileInfo`.

Ahí aparece la representación que suele resultar extraña al verla por primera vez:

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

El objeto interior sigue siendo exactamente el mismo `FileInfo`.

La parte nueva:

```text
com.fernandez.topic.item.FileInfo
```

sirve para identificar la rama de la union que contiene el valor.

## ¿De dónde sale `com.fernandez.topic.item.FileInfo`?

Sale directamente del namespace:

```avro
@namespace("com.fernandez.topic.item")
```

y de la definición:

```avro
record FileInfo {
    ...
}
```

El nombre corto del record es:

```text
FileInfo
```

y su nombre completo es:

```text
com.fernandez.topic.item.FileInfo
```

Es muy parecido al concepto de package en Java.

Por ejemplo:

```java
package com.fernandez.topic.item;

class FileInfo {
}
```

El nombre completo de esa clase sería:

```text
com.fernandez.topic.item.FileInfo
```

En Avro, los records son tipos con nombre, y el namespace forma parte de su identidad.

## Comparación directa

La diferencia se entiende mejor viendo ambos casos juntos.

### Sin union

Schema:

```avro
FileInfo fileInfo;
```

Modelo mental:

```text
fileInfo -> FileInfo
```

Representación:

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

### Con union

Schema:

```avro
FileInfo? fileInfo = null;
```

Modelo mental:

```text
fileInfo -> null | FileInfo
```

Una representación explícita de la union puede ser:

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

La diferencia no está en el record `FileInfo`. Su contenido no ha cambiado.

Lo que ha cambiado es el **tipo de `ItemCommand.fileInfo`**.

## ¿Por qué ahora puede volver a verse sin el wrapper?

En algunos casos el mensaje puede volver a mostrarse así:

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

aunque el schema siga declarando:

```avro
FileInfo? fileInfo = null;
```

Esto no implica necesariamente que la union haya desaparecido.

Hay que distinguir entre dos cosas:

```text
Schema Avro
Representación JSON que muestra una herramienta o serializer
```

El schema puede seguir siendo:

```text
null | FileInfo
```

mientras una librería, una UI de Kafka, un mapper o una capa de serialización decide mostrar el objeto sin el wrapper del tipo.

Por eso, cuando cambia la apariencia del JSON, lo primero que hay que comprobar es si realmente cambió el schema o si simplemente cambió la forma de convertir o visualizar el dato Avro.

## La idea que conviene recordar

Todo el caso se reduce a este cambio:

```avro
FileInfo fileInfo;
```

frente a:

```avro
FileInfo? fileInfo = null;
```

El primero significa:

```text
Siempre hay un FileInfo.
```

El segundo significa:

```text
Puede haber null o FileInfo.
```

Y eso, en Avro, es una **union**.

Cuando una representación JSON necesita hacer explícita la rama utilizada, puede mostrar:

```text
com.fernandez.topic.item.FileInfo
```

El namespace no se ha convertido en un nuevo campo del modelo. Simplemente identifica el tipo `FileInfo` dentro de la union.

Ese es el motivo por el que un cambio tan pequeño en el schema puede producir una diferencia tan visible en el JSON.
