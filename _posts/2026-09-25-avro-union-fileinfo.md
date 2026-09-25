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
<style>
.interview-note{--panel:var(--surface);--muted:var(--ink-soft);--line:var(--line);--notice:var(--accent-soft);--warn:#8b5a16;--warn-bg:#f7eddd;max-width:940px;margin:36px auto 96px;padding:0 24px}.interview-note .titleblock,.interview-note .card,.interview-note .answer{background:var(--panel);border:1px solid var(--line)}.interview-note .titleblock{position:relative;padding:32px;overflow:hidden}.interview-note .back,.interview-note .lang,.interview-note .eyebrow,.interview-note .num,.interview-note .stamp dt,.interview-note pre,.interview-note code{font-family:"IBM Plex Mono",monospace}.interview-note .back,.interview-note .lang{font-size:.74rem}.interview-note .lang{position:absolute;right:24px;top:20px}.interview-note .eyebrow,.interview-note .num{color:var(--accent);font-size:.76rem;text-transform:uppercase}.interview-note h1,.interview-note h2,.interview-note h3{font-family:"Barlow Condensed","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.01em;margin:0}.interview-note .titleblock h1{font-size:clamp(2.35rem,7vw,4rem);line-height:1;max-width:20ch}.interview-note .lede{font-size:1.03rem;color:var(--muted);max-width:68ch}.interview-note .stamp{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;border-top:1px solid var(--line);padding-top:16px}.interview-note .stamp>div{padding:12px;background:var(--surface-2);border-radius:8px}.interview-note .stamp dt{font-size:.67rem;color:var(--muted);text-transform:uppercase}.interview-note .stamp dd{margin:4px 0 0;font-weight:600}.interview-note section{margin-top:64px}.interview-note .head{display:flex;gap:12px;align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:9px}.interview-note h2{font-size:clamp(1.6rem,4vw,2rem)}.interview-note h3{font-size:1.12rem;margin-top:30px}.interview-note p,.interview-note li{max-width:74ch;line-height:1.72}.interview-note .answer{padding:20px 22px;border-left:4px solid var(--accent);font-size:1.02rem;border-radius:10px}.interview-note .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:20px 0}.interview-note .card{padding:17px;border-radius:10px}.interview-note .card h3{margin:0 0 7px}.interview-note .card p{font-size:.93rem;color:var(--muted);margin:0}.interview-note pre{overflow:auto;background:var(--code-bg);color:var(--code-ink);padding:16px;border-radius:10px;line-height:1.55;font-size:.82rem}.interview-note .notice,.interview-note .trap{padding:15px 18px;border-radius:10px}.interview-note .notice{border-left:3px solid var(--accent);background:var(--notice)}.interview-note .trap{border-left:3px solid var(--warn);background:var(--warn-bg)}.interview-note footer{color:var(--muted);border-top:1px solid var(--line);margin-top:52px;padding-top:20px}.interview-note .small{font-size:.9rem}@media(max-width:680px){.interview-note{padding:0 16px}.interview-note .grid,.interview-note .stamp{grid-template-columns:1fr}.interview-note .titleblock{padding:24px 20px}.interview-note .lang{position:static}.interview-note p,.interview-note li{text-align:left}}
</style>
<div class="sheet interview-note">
<div class="titleblock"><p class="back"><a href="{{ '/' | relative_url }}">&larr; Back to the blog</a></p><p class="lang"><a href="es/">ES · Español</a></p><p class="eyebrow">Java & Spring · Event Streaming · Avro</p><h1>Union in Avro</h1><p class="lede">Why changing <code>FileInfo fileInfo;</code> to <code>FileInfo? fileInfo = null;</code> can make the record's fully qualified name appear in the JSON representation.</p><dl class="stamp"><div><dt>Level</dt><dd>Fundamentals</dd></div><div><dt>Scope</dt><dd>Apache Avro</dd></div><div><dt>Key idea</dt><dd>An optional field is a union</dd></div></dl></div>

<section id="case"><div class="head"><span class="num">01</span><h2>The change that causes everything</h2></div>
<p>We start with a required field:</p>
<pre>FileInfo fileInfo;</pre>
<p>Here, <code>fileInfo</code> can only contain a <code>FileInfo</code>:</p>
<pre>fileInfo -> FileInfo</pre>
<p>So its JSON representation can be direct:</p>
<pre>{
  "fileInfo": {
    "creationTimestamp": null,
    "fileName": "",
    "fileUrl": "",
    "numberRecords": 0,
    "version": null
  }
}</pre>
<p>Avro does not need to state which type is inside <code>fileInfo</code>, because the schema already says it can only be <code>FileInfo</code>.</p>
</section>

<section id="union"><div class="head"><span class="num">02</span><h2>Making it optional creates a union</h2></div>
<p>Now we change the definition:</p>
<pre>FileInfo? fileInfo = null;</pre>
<p>For Avro, the field can now contain two alternatives:</p>
<pre>fileInfo -> null | FileInfo</pre>
<p class="answer"><strong>This is the key point:</strong> <code>FileInfo?</code> is not merely “FileInfo with null allowed”. In Avro's type model it becomes a <strong>union</strong> between <code>null</code> and <code>FileInfo</code>.</p>
<p>Conceptually, that union can be represented as:</p>
<pre>[
  "null",
  "com.fernandez.topic.item.FileInfo"
]</pre>
</section>

<section id="json"><div class="head"><span class="num">03</span><h2>Why the fully qualified type name appears</h2></div>
<p>When the value is <code>null</code>, the selected branch is obvious:</p>
<pre>{
  "fileInfo": null
}</pre>
<p>When it contains a record, an explicit union representation may state which branch was selected:</p>
<pre>{
  "fileInfo": {
    "com.fernandez.topic.item.FileInfo": {
      "creationTimestamp": null,
      "fileName": "",
      "fileUrl": "",
      "numberRecords": 0,
      "version": null
    }
  }
}</pre>
<p>The key <code>com.fernandez.topic.item.FileInfo</code> is not a new business field. It identifies the selected type inside the union.</p>
</section>

<section id="namespace"><div class="head"><span class="num">04</span><h2>Where com.fernandez.topic.item.FileInfo comes from</h2></div>
<p>It comes from the protocol namespace:</p>
<pre>@namespace("com.fernandez.topic.item")
protocol ItemProtocol {
    ...
}</pre>
<p>and from the record declaration:</p>
<pre>record FileInfo {
    string fileName;
    string fileUrl;
    string? version = null;
    int? numberRecords = 0;
    timestamp_ms? creationTimestamp = null;
}</pre>
<p>The short name is <code>FileInfo</code>, while the fully qualified name is:</p>
<pre>com.fernandez.topic.item.FileInfo</pre>
<p>This is similar to a Java class name inside a package.</p>
</section>

<section id="comparison"><div class="head"><span class="num">05</span><h2>The comparison to remember</h2></div>
<div class="grid"><article class="card"><h3>Without a union</h3><pre>FileInfo fileInfo;</pre><p>There is only one possible type: <code>FileInfo</code>.</p></article><article class="card"><h3>With a union</h3><pre>FileInfo? fileInfo = null;</pre><p>There are two possible types: <code>null</code> or <code>FileInfo</code>.</p></article></div>
<p class="notice"><strong>The FileInfo record has not changed.</strong> What changed is the type of <code>ItemCommand.fileInfo</code>.</p>
</section>

<section id="wrapper"><div class="head"><span class="num">06</span><h2>What if it appears without the wrapper again?</h2></div>
<p>You may still see the message displayed like this:</p>
<pre>{
  "fileInfo": {
    "creationTimestamp": null,
    "fileName": "",
    "fileUrl": "",
    "numberRecords": 0,
    "version": null
  }
}</pre>
<p>even if the schema still contains:</p>
<pre>FileInfo? fileInfo = null;</pre>
<p>That does not prove the union disappeared. The <strong>Avro schema</strong> and the <strong>JSON representation</strong> produced by a library, Kafka UI, mapper or serializer are different things. A tool may hide the wrapper while the underlying type remains <code>null | FileInfo</code>.</p>
</section>

<footer><p><strong>Key idea:</strong> changing <code>FileInfo fileInfo;</code> to <code>FileInfo? fileInfo = null;</code> turns the field into a union. The name <code>com.fernandez.topic.item.FileInfo</code> may appear in JSON to identify which branch of that union contains the value.</p></footer>
</div>