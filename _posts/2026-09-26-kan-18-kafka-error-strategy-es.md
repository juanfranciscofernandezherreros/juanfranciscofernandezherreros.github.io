---
layout: "article"
title: "KAN-18: estrategia común de errores Kafka, retries y DLT"
description: "Plan de trabajo de KAN-18 para unificar clasificación de errores, retries, backoff y DLT en los microservicios Basketball Stats."
permalink: "/java-spring/kan-18-kafka-error-strategy/es/"
lang: "es"
lang_url: ""
series: "Basketball CSV Microservices"
categories: ["Java & Spring"]
subcategories: ["Event Streaming"]
tags: ["kafka","spring-kafka","retries","dlt","error-handling","microservices","jira","basketball-stats"]
date: "2026-09-26"
reading_minutes: 11
published: true
---

# KAN-18: estrategia común de errores Kafka, retries y DLT

El pipeline CSV de Basketball Stats está dividido en varios microservicios. Esa separación permite evolucionar cada pieza de forma independiente, pero introduce un riesgo importante: que cada consumidor Kafka gestione los errores de una manera diferente.

[KAN-18](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-18) existe para evitarlo. El objetivo no es añadir una configuración aislada a un servicio, sino definir una **estrategia común de recuperación de errores** para todo el pipeline: qué se reintenta, qué no, cuánto se espera entre intentos, cuándo un mensaje termina en una Dead Letter Topic y qué información debe conservarse para poder diagnosticar el problema.

Actualmente KAN-18 está **Por hacer** y tiene prioridad **Highest**.

## El problema que hay que resolver

No todos los errores deben tratarse igual.

Un dato inválido no va a corregirse por repetir el consumo cinco veces. Si un CSV contiene un campo imposible, un evento incumple el contrato o una regla de dominio rechaza el mensaje, insistir solo añade latencia, ruido y carga.

Un fallo de infraestructura, en cambio, puede ser temporal. PostgreSQL puede estar indisponible unos segundos, Kafka puede sufrir una incidencia transitoria o una dependencia externa puede recuperarse sin intervención.

La estrategia debe convertir esa diferencia en una regla explícita:

- **errores permanentes de datos** → no consumir retries inútiles;
- **errores transitorios de infraestructura** → aplicar retries y backoff;
- **errores agotados** → enviarlos a una salida controlada, normalmente DLT;
- **todos los fallos** → conservar contexto suficiente para diagnóstico.

KAN-18 debe dejar estas reglas claras antes de replicarlas por todos los servicios.

## 1. Definir una taxonomía común de errores

El primer trabajo no es configurar un `DefaultErrorHandler`. Es acordar qué tipos de error existen en el sistema.

La clasificación debería separar al menos cuatro familias.

### Errores de datos y validación

Aquí entran errores que dependen del contenido del mensaje:

- CSV inválido;
- columnas ausentes o con orden incorrecto;
- nombres de fichero no válidos;
- conversiones numéricas imposibles;
- campos obligatorios ausentes;
- valores que violan reglas de dominio;
- claves o identificadores inconsistentes.

Estos errores son normalmente **non-retryable**. Reprocesar el mismo mensaje sin cambiar nada no va a producir un resultado diferente.

### Errores de contrato

Aquí entran problemas como:

- mensajes incompatibles con el schema esperado;
- deserialización imposible;
- headers obligatorios ausentes;
- cambios incompatibles entre productor y consumidor.

Estos errores también deberían tratarse como permanentes salvo que exista una causa externa claramente recuperable.

El trabajo de contratos está relacionado con [KAN-17](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-17) y con las pruebas de compatibilidad de [KAN-24](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-24).

### Errores transitorios de infraestructura

Son fallos que pueden desaparecer sin modificar el mensaje:

- conexión temporalmente perdida con PostgreSQL;
- indisponibilidad temporal de Kafka;
- Schema Registry no disponible;
- timeout contra una dependencia;
- errores de red;
- recursos temporalmente saturados.

Estos sí son candidatos claros a retry.

### Errores desconocidos

Debe existir un comportamiento de seguridad para excepciones no clasificadas, pero no debería convertirse en la categoría habitual.

Si muchos errores acaban aquí, la taxonomía necesita evolucionar.

## 2. Definir la política de retries

Una vez clasificados los fallos hay que decidir cómo se reintentan.

KAN-18 exige que los fallos transitorios tengan reintentos configurables y que los errores de datos no se reintenten inútilmente.

La definición común debería dejar cerradas estas decisiones:

- qué familias son retryable;
- qué familias son non-retryable;
- número máximo de intentos;
- tipo de backoff;
- duración inicial del backoff;
- límites máximos;
- parámetros configurables por entorno;
- comportamiento cuando se agotan todos los intentos.

La idea es que los microservicios puedan ajustar valores operativos cuando sea necesario sin inventar políticas incompatibles.

## 3. Definir la salida de errores agotados

Cuando un mensaje no puede procesarse después de los intentos permitidos, tiene que existir una salida explícita.

En consumidores Spring Kafka, la salida natural será normalmente una Dead Letter Topic. En otros casos puede existir un mecanismo equivalente.

El caso especial es el router. [KAN-101](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-101) ya indica que, si el servicio usa Kafka Streams, debe existir una salida observable equivalente aunque no sea idéntica a la DLT de los consumidores tradicionales.

La estrategia común debe definir:

- convención de nombres de DLT;
- relación entre topic original y topic de errores;
- datos mínimos que se conservan;
- identificación del servicio que falló;
- cómo se diferencia un error permanente de uno agotado;
- qué procedimiento existe para inspeccionar o reprocesar esos mensajes.

Una DLT sin contexto no resuelve el problema. Solo mueve el mensaje a otro sitio.

## 4. Conservar contexto suficiente para diagnóstico

El criterio de aceptación de KAN-18 exige que los mensajes agotados lleguen a DLT con información suficiente para diagnosticar el fallo.

El contexto mínimo debería permitir reconstruir qué ocurrió sin depender únicamente de logs dispersos.

Entre los datos útiles están:

- topic original;
- partición;
- offset;
- timestamp;
- servicio consumidor;
- tipo de excepción;
- mensaje de excepción;
- identificador del evento;
- `sourceEventId` cuando exista;
- número de intentos;
- operación que se estaba ejecutando;
- headers relevantes.

No todo tiene que viajar necesariamente dentro del payload. Parte puede ir en headers o en metadatos, pero el estándar tiene que dejar claro qué se considera obligatorio.

## 5. Hacer observable el error

KAN-18 está relacionada con la estrategia de observabilidad del pipeline.

No basta con enviar mensajes a DLT. Hay que poder detectar que el sistema está degradándose.

La estrategia debería permitir medir, como mínimo:

- número de retries;
- mensajes enviados a DLT;
- errores por categoría;
- errores por servicio;
- tiempo invertido en reintentos;
- crecimiento anómalo de mensajes fallidos.

Esto debe integrarse con el trabajo de observabilidad de [KAN-21](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-21).

## 6. Probar el comportamiento, no solo la configuración

Los tickets de implantación de KAN-18 exigen tests que cubran al menos dos escenarios.

### Error permanente

Debe demostrarse que un dato inválido:

1. se clasifica como non-retryable;
2. no consume retries innecesarios;
3. termina en la salida definida;
4. conserva contexto suficiente.

### Error transitorio

Debe demostrarse que un fallo temporal:

1. se clasifica como retryable;
2. activa la política de retries;
3. respeta el backoff configurado;
4. puede recuperarse si la dependencia vuelve;
5. termina en DLT si agota los intentos.

Una configuración que no está validada por tests no es suficiente para cerrar KAN-18.

## Dependencias actuales de KAN-18

Jira tiene modelada actualmente esta cadena:

**[KAN-17](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-17) → [KAN-24](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-24) → KAN-18 → [KAN-19](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-19) → [KAN-22](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-22)**

En el tablero, KAN-18 aparece bloqueada por KAN-24 y a su vez bloquea KAN-19.

La relación entre KAN-24 y KAN-18 conviene revisarla antes de empezar la implantación masiva. KAN-24 se centra en pruebas de contrato parser ↔ persistence, mientras que KAN-18 se centra en recuperación de errores Kafka. Puede existir relación, pero hay que confirmar si es una dependencia estricta o solo un orden introducido en Jira.

## Tickets que implementan KAN-18

Una vez definida la estrategia común, debe aplicarse por servicio.

| Ticket | Servicio | Estado |
| --- | --- | --- |
| [KAN-101](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-101) | csv-file-event-router | Por hacer |
| [KAN-102](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-102) | csv-results-parser | Finalizado |
| [KAN-103](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-103) | csv-results-persistence | Por hacer |
| [KAN-104](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-104) | csv-fixtures-parser | Por hacer |
| [KAN-105](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-105) | csv-fixtures-persistence | Por hacer |
| [KAN-106](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-106) | csv-stats-match-parser | Por hacer |
| [KAN-107](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-107) | csv-stats-match-persistence | Por hacer |
| [KAN-108](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-108) | csv-stats-player-parser | Por hacer |
| [KAN-109](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-109) | csv-stats-player-persistence | Por hacer |
| [KAN-110](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-110) | csv-point-by-point-parser | Por hacer |
| [KAN-111](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-111) | csv-point-by-point-persistence | Por hacer |
| [KAN-112](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-112) | csv-team-stats-parser | Por hacer |
| [KAN-113](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-113) | csv-team-stats-persistence | Por hacer |

Solo KAN-102 figura actualmente como Finalizado.

## Repositorios implicados

La estrategia afecta a prácticamente todo el pipeline CSV:

- [csv-file-event-router](https://github.com/juanfranciscofernandezherreros/csv-file-event-router)
- [csv-results-parser](https://github.com/juanfranciscofernandezherreros/csv-results-parser)
- [csv-results-persistence](https://github.com/juanfranciscofernandezherreros/csv-results-persistence)
- [csv-fixtures-parser](https://github.com/juanfranciscofernandezherreros/csv-fixtures-parser)
- [csv-fixtures-persistence](https://github.com/juanfranciscofernandezherreros/csv-fixtures-persistence)
- [csv-stats-match-parser](https://github.com/juanfranciscofernandezherreros/csv-stats-match-parser)
- [csv-stats-match-persistence](https://github.com/juanfranciscofernandezherreros/csv-stats-match-persistence)
- [csv-stats-player-parser](https://github.com/juanfranciscofernandezherreros/csv-stats-player-parser)
- [csv-stats-player-persistence](https://github.com/juanfranciscofernandezherreros/csv-stats-player-persistence)
- [csv-point-by-point-parser](https://github.com/juanfranciscofernandezherreros/csv-point-by-point-parser)
- [csv-point-by-point-persistence](https://github.com/juanfranciscofernandezherreros/csv-point-by-point-persistence)
- [csv-team-stats-parser](https://github.com/juanfranciscofernandezherreros/csv-team-stats-parser)
- [csv-team-stats-persistence](https://github.com/juanfranciscofernandezherreros/csv-team-stats-persistence)

## KAN-102 debe revisarse antes de usarlo como modelo

[KAN-102](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-102) está Finalizado y representa la implantación de la estrategia en RESULTS parser.

No hay que rehacerlo automáticamente.

Lo correcto es usarlo como implementación de referencia y comprobar, cuando KAN-18 deje cerrada la estrategia, que realmente cumple el estándar final.

Si coincide, permanece cerrado. Si no coincide, la diferencia debe quedar identificada antes de cerrar KAN-18.

## La anomalía de KAN-98, KAN-99 y KAN-100

Hay tres tickets que requieren revisión especial:

- [KAN-98](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-98)
- [KAN-99](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-99)
- [KAN-100](https://juanfranciscofernandezherreros.atlassian.net/browse/KAN-100)

Sus títulos indican trabajo de observabilidad asociado a KAN-21, pero sus descripciones contienen criterios propios de KAN-18: clasificación retryable/non-retryable, backoff, DLT y tests de errores.

Eso entra en conflicto con tres tickets específicos de KAN-18:

- KAN-111 para POINT-BY-POINT persistence;
- KAN-112 para TEAM-STATS parser;
- KAN-113 para TEAM-STATS persistence.

Antes de empezar KAN-111, KAN-112 o KAN-113 hay que revisar qué se implementó realmente en KAN-98, KAN-99 y KAN-100.

Si las descripciones reflejan el trabajo real, puede existir duplicidad. Si los títulos reflejan el trabajo real y las descripciones están equivocadas, entonces KAN-111/112/113 continúan íntegramente pendientes.

## Orden recomendado de ejecución

### Fase 1. Revisar dependencias

Antes de tocar los microservicios:

1. revisar KAN-17;
2. revisar KAN-24;
3. confirmar si KAN-24 debe bloquear realmente KAN-18;
4. confirmar la relación KAN-18 → KAN-19;
5. revisar KAN-98/99/100 para descartar trabajo duplicado.

### Fase 2. Cerrar la definición de KAN-18

Definir y documentar:

1. taxonomía de errores;
2. retryable vs non-retryable;
3. número de intentos;
4. backoff;
5. DLT o mecanismo equivalente;
6. metadatos de diagnóstico;
7. métricas;
8. comportamiento de tests;
9. excepciones justificadas por servicio.

El resultado de esta fase debe ser una política que pueda leer cualquier desarrollador antes de implementar su ticket.

### Fase 3. Revisar KAN-102

Comprobar RESULTS parser contra la estrategia definitiva.

KAN-102 debe servir como referencia solo si su comportamiento coincide con lo acordado.

### Fase 4. Implementar las adopciones por servicio

Con la estrategia estable, los tickets siguientes pueden avanzar en paralelo en buena medida:

**Router**
- KAN-101

**RESULTS**
- KAN-103

**FIXTURES**
- KAN-104
- KAN-105

**MATCH**
- KAN-106
- KAN-107

**PLAYER**
- KAN-108
- KAN-109

**POINT-BY-POINT**
- KAN-110
- KAN-111

**TEAM-STATS**
- KAN-112
- KAN-113

### Fase 5. Validación transversal

Antes de cerrar KAN-18 hay que comprobar que todos los servicios respetan las mismas reglas:

- misma clasificación conceptual;
- configuración equivalente;
- DLT coherentes;
- contexto de diagnóstico suficiente;
- tests de error permanente;
- tests de error transitorio;
- documentación común actualizada.

### Fase 6. Cerrar KAN-18

KAN-18 no debería cerrarse al terminar solo la definición arquitectónica.

Debe permanecer abierta mientras haya adopciones pendientes que formen parte de su alcance.

Siguiendo esa regla, el padre solo se considera realmente finalizado cuando las implementaciones asociadas estén finalizadas y validadas.

## Qué revisar antes de empezar cada ticket

Antes de comenzar cualquiera de KAN-101 a KAN-113 conviene hacer una revisión corta del ticket y del repositorio correspondiente.

La revisión debería responder estas preguntas:

1. ¿Qué consumidor Kafka tiene el servicio?
2. ¿Usa Spring Kafka tradicional o Kafka Streams?
3. ¿Qué manejo de errores existe ya?
4. ¿Qué excepciones de dominio tiene?
5. ¿Qué fallos son permanentes y cuáles transitorios?
6. ¿Existe DLT actualmente?
7. ¿Qué configuración de retries existe?
8. ¿Qué tests de error existen?
9. ¿Qué metadatos pueden usarse para diagnóstico?
10. ¿Hay otro ticket del tablero que vaya a modificar la misma zona?

Ese análisis debe hacerse **justo antes de comenzar cada ticket**, porque el estado del repositorio y del tablero puede haber cambiado.

## Criterio de finalización

KAN-18 estará realmente terminada cuando:

- exista una estrategia común documentada;
- todos los consumidores distingan errores permanentes y transitorios;
- los retries sean configurables;
- el backoff sea coherente;
- los mensajes agotados tengan salida controlada;
- la DLT conserve contexto suficiente;
- existan tests de error permanente y transitorio;
- KAN-101 y KAN-103–113 estén finalizados;
- KAN-102 haya sido validado contra el estándar definitivo;
- KAN-98/99/100 hayan sido aclarados;
- no queden servicios aplicando políticas incompatibles.

## Siguiente paso

El siguiente paso no es modificar todos los servicios a la vez.

Primero hay que convertir KAN-18 en una especificación operativa suficientemente clara para que cada implementación pueda ejecutarse sin reinterpretar la estrategia.

Después, antes de empezar cada ticket de adopción, se revisará de nuevo el ticket, sus dependencias y el repositorio correspondiente para decidir exactamente qué trabajo toca hacer en ese momento.
