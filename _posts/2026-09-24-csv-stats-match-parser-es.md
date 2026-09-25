---
layout: "article"
title: "csv-stats-match-parser · CHANGELOG.md"
description: "CHANGELOG.md de csv-stats-match-parser."
permalink: "/java-spring/csv-stats-match-parser/es/"
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
- Simplifica el contrato intermedio: el parser publica solo resúmenes válidos.
- Elimina los mensajes `FAILED` y metadatos que persistence no necesita.

## 1.0.0 - 2026-09-24
- Separa el parser de MATCH_SUMMARY.
- Publica en `stats-match.parsed`.
- Elimina JPA, PostgreSQL y Flyway.
- Añade auto-merge tras checks y borrado de rama.
