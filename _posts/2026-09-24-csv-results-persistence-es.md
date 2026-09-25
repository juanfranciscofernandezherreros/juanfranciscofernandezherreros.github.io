---
layout: "article"
title: "csv-results-persistence · CHANGELOG.md"
description: "CHANGELOG.md de csv-results-persistence."
permalink: "/java-spring/csv-results-persistence/es/"
lang: "es"
lang_url: ""
series: "Basketball CSV Microservices"
categories: ["Java & Spring"]
subcategories: ["Event Streaming"]
tags: ["changelog","csv","microservices"]
date: "2026-09-24"
reading_minutes: 3
index_hidden: true
published: true
---

# Changelog

## 1.0.1 - 2026-09-24

- Añade limpieza automática de ramas de pull requests mergeadas y elimina la rama histórica residual.
- Actualiza la versión de `1.0.0` a `1.0.1`.

## 1.0.0 - 2026-09-24

- Crea el microservicio `csv-results-persistence`.
- Consume mensajes Avro `MatchResultKey` / `MatchResultValue` desde `results.parsed`.
- Persiste los resultados con Spring Data JPA en PostgreSQL.
- Crea la tabla `results` mediante Flyway y usa `match_id` como clave primaria para soportar reentregas idempotentes.
- Añade tests unitarios y una prueba de integración PostgreSQL con Testcontainers.
- Añade CI con JDK 21 para `mvn -B verify -Pintegration`.
