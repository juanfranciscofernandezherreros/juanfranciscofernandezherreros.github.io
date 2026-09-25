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
<style>
.interview-note{--panel:var(--surface);--muted:var(--ink-soft);--line:var(--line);--notice:var(--accent-soft);--warn:#8b5a16;--warn-bg:#f7eddd;max-width:940px;margin:36px auto 96px;padding:0 24px}.interview-note .titleblock,.interview-note .card,.interview-note .answer{background:var(--panel);border:1px solid var(--line)}.interview-note .titleblock{position:relative;padding:32px;overflow:hidden}.interview-note .back,.interview-note .lang,.interview-note .eyebrow,.interview-note .num,.interview-note .stamp dt,.interview-note pre,.interview-note code{font-family:"IBM Plex Mono",monospace}.interview-note .back,.interview-note .lang{font-size:.74rem}.interview-note .lang{position:absolute;right:24px;top:20px}.interview-note .eyebrow,.interview-note .num{color:var(--accent);font-size:.76rem;text-transform:uppercase}.interview-note h1,.interview-note h2,.interview-note h3{font-family:"Barlow Condensed","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.01em;margin:0}.interview-note .titleblock h1{font-size:clamp(2.35rem,7vw,4rem);line-height:1;max-width:20ch}.interview-note .lede{font-size:1.03rem;color:var(--muted);max-width:68ch}.interview-note .stamp{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;border-top:1px solid var(--line);padding-top:16px}.interview-note .stamp>div{padding:12px;background:var(--surface-2);border-radius:8px}.interview-note .stamp dt{font-size:.67rem;color:var(--muted);text-transform:uppercase}.interview-note .stamp dd{margin:4px 0 0;font-weight:600}.interview-note section{margin-top:64px}.interview-note .head{display:flex;gap:12px;align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:9px}.interview-note h2{font-size:clamp(1.6rem,4vw,2rem)}.interview-note h3{font-size:1.12rem;margin-top:30px}.interview-note p,.interview-note li{max-width:74ch;line-height:1.72}.interview-note .answer{padding:20px 22px;border-left:4px solid var(--accent);font-size:1.02rem;border-radius:10px}.interview-note .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:20px 0}.interview-note .card{padding:17px;border-radius:10px}.interview-note .card h3{margin:0 0 7px}.interview-note .card p{font-size:.93rem;color:var(--muted);margin:0}.interview-note pre{overflow:auto;background:var(--code-bg);color:var(--code-ink);padding:16px;border-radius:10px;line-height:1.55;font-size:.82rem}.interview-note .notice,.interview-note .trap{padding:15px 18px;border-radius:10px}.interview-note .notice{border-left:3px solid var(--accent);background:var(--notice)}.interview-note .trap{border-left:3px solid var(--warn);background:var(--warn-bg)}.interview-note footer{color:var(--muted);border-top:1px solid var(--line);margin-top:52px;padding-top:20px}.interview-note .small{font-size:.9rem}@media(max-width:680px){.interview-note{padding:0 16px}.interview-note .grid,.interview-note .stamp{grid-template-columns:1fr}.interview-note .titleblock{padding:24px 20px}.interview-note .lang{position:static}.interview-note p,.interview-note li{text-align:left}}
</style>
<div class="sheet interview-note">
<div class="titleblock"><p class="back"><a href="{{ '/' | relative_url }}">&larr; Volver al blog</a></p><p class="lang"><a href="../">EN · English</a></p><p class="eyebrow">Java & Spring · Event Streaming · Avro</p><h1>Union en Avro</h1><p class="lede">Por qué cambiar <code>FileInfo fileInfo;</code> por <code>FileInfo? fileInfo = null;</code> puede hacer que el nombre completo del record aparezca en la representación JSON.</p><dl class="stamp"><div><dt>Nivel</dt><dd>Fundamentos</dd></div><div><dt>Ámbito</dt><dd>Apache Avro</dd></div><div><dt>Idea clave</dt><dd>Un campo opcional es una union</dd></div></dl></div>

<section id="case"><div class="head"><span class="num">01</span><h2>El cambio que provoca todo</h2></div>
<p>Partimos de un campo obligatorio:</p>
<pre>FileInfo fileInfo;</pre>
<p>En ese caso, <code>fileInfo</code> solo puede contener un <code>FileInfo</code>:</p>
<pre>fileInfo -> FileInfo</pre>
<p>Por eso una representación JSON puede ser directa:</p>
<pre>{
  "fileInfo": {
    "creationTimestamp": null,
    "fileName": "",
    "fileUrl": "",
    "numberRecords": 0,
    "version": null
  }
}</pre>
<p>Avro no necesita indicar qué tipo hay dentro de <code>fileInfo</code>, porque el schema ya dice que solo puede ser <code>FileInfo</code>.</p>
</section>

<section id="union"><div class="head"><span class="num">02</span><h2>Al hacerlo opcional aparece una union</h2></div>
<p>Después cambiamos la definición:</p>
<pre>FileInfo? fileInfo = null;</pre>
<p>Para Avro, esto significa que el campo puede contener dos alternativas:</p>
<pre>fileInfo -> null | FileInfo</pre>
<p class="answer"><strong>Ese es el punto importante:</strong> <code>FileInfo?</code> no es simplemente “FileInfo con null permitido”. En el modelo de tipos de Avro se convierte en una <strong>union</strong> entre <code>null</code> y <code>FileInfo</code>.</p>
<p>Conceptualmente, esa union puede verse así:</p>
<pre>[
  "null",
  "com.fernandez.topic.item.FileInfo"
]</pre>
</section>

<section id="json"><div class="head"><span class="num">03</span><h2>Por qué aparece el nombre completo del tipo</h2></div>
<p>Cuando el valor es <code>null</code>, la rama seleccionada es evidente:</p>
<pre>{
  "fileInfo": null
}</pre>
<p>Cuando contiene un record, una representación explícita de la union puede indicar qué rama se ha elegido:</p>
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
<p>La clave <code>com.fernandez.topic.item.FileInfo</code> no es un nuevo campo de negocio. Es el identificador del tipo seleccionado dentro de la union.</p>
</section>

<section id="namespace"><div class="head"><span class="num">04</span><h2>De dónde sale com.fernandez.topic.item.FileInfo</h2></div>
<p>Sale del namespace del protocolo:</p>
<pre>@namespace("com.fernandez.topic.item")
protocol ItemProtocol {
    ...
}</pre>
<p>y del record:</p>
<pre>record FileInfo {
    string fileName;
    string fileUrl;
    string? version = null;
    int? numberRecords = 0;
    timestamp_ms? creationTimestamp = null;
}</pre>
<p>El nombre corto es <code>FileInfo</code>, pero su nombre completo es:</p>
<pre>com.fernandez.topic.item.FileInfo</pre>
<p>Es parecido al nombre completo de una clase Java dentro de un package.</p>
</section>

<section id="comparison"><div class="head"><span class="num">05</span><h2>La comparación que hay que recordar</h2></div>
<div class="grid"><article class="card"><h3>Sin union</h3><pre>FileInfo fileInfo;</pre><p>Solo existe una posibilidad: <code>FileInfo</code>.</p></article><article class="card"><h3>Con union</h3><pre>FileInfo? fileInfo = null;</pre><p>Existen dos posibilidades: <code>null</code> o <code>FileInfo</code>.</p></article></div>
<p class="notice"><strong>El record FileInfo no ha cambiado.</strong> Lo que ha cambiado es el tipo de <code>ItemCommand.fileInfo</code>.</p>
</section>

<section id="wrapper"><div class="head"><span class="num">06</span><h2>¿Y si ahora vuelve a verse sin el wrapper?</h2></div>
<p>Es posible volver a ver el mensaje así:</p>
<pre>{
  "fileInfo": {
    "creationTimestamp": null,
    "fileName": "",
    "fileUrl": "",
    "numberRecords": 0,
    "version": null
  }
}</pre>
<p>aunque el schema siga utilizando:</p>
<pre>FileInfo? fileInfo = null;</pre>
<p>Eso no demuestra que la union haya desaparecido. Hay que distinguir el <strong>schema Avro</strong> de la <strong>representación JSON</strong> generada por una librería, una UI de Kafka, un mapper o un serializer. Una herramienta puede ocultar el wrapper aunque internamente el tipo continúe siendo <code>null | FileInfo</code>.</p>
</section>

<footer><p><strong>Idea clave:</strong> pasar de <code>FileInfo fileInfo;</code> a <code>FileInfo? fileInfo = null;</code> convierte el campo en una union. El nombre <code>com.fernandez.topic.item.FileInfo</code> puede aparecer en JSON para indicar qué rama de esa union contiene el valor.</p></footer>
</div>