---
layout: "article"
title: "csv-stats-player-persistence · CHANGELOG.md"
description: "CHANGELOG.md de csv-stats-player-persistence."
permalink: "/java-spring/csv-stats-player-persistence/es/"
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

## 1.0.2 - 2026-09-24
- Corrige el escape inválido de las anotaciones JPA.
- Activa `hibernate.globally_quoted_identifiers` para soportar correctamente las columnas reservadas `"or"` y `"to"`.

## 1.0.1 - 2026-09-24
- Corrige el mapeo JPA de las columnas PostgreSQL reservadas `"or"` y `"to"`.

## 1.0.0 - 2026-09-24
- Separa la persistencia de STATS_PLAYER del consumer monolítico.
- Consume `stats-player.parsed` en Avro.
- Persiste en PostgreSQL `stats_player` con Flyway.
- Hace upsert por `(match_id, name, team)`.
