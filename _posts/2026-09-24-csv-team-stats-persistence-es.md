---
layout: "article"
title: "csv-team-stats-persistence · CHANGELOG.md"
description: "CHANGELOG.md de csv-team-stats-persistence."
permalink: "/java-spring/csv-team-stats-persistence/es/"
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

## 1.0.0 - 2026-09-24
- Consume `team-stats.parsed` en Avro.
- Persiste estadísticas Overall y por cuarto en PostgreSQL `team_stats`.
- Hace upsert por `(match_id, period, category, metric)`.
- Añade índices por partido y por partido/periodo para facilitar la futura API agregadora.
