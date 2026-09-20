# Estructura, bilingüismo y descubrimiento

## Series y continuidad

Los artículos de Argo Real World Microservices viven en _posts/ y usan:

    /argo-real-world-microservices/part-N/<slug-descriptivo>/
    /argo-real-world-microservices/part-N/<slug-descriptivo>/es/

Nunca uses /part-N/ a secas. El slug debe ser el mismo en EN y ES; solo cambia /es/.

Nombres de archivo:

    _posts/YYYY-MM-DD-part-N-<slug>.html
    _posts/YYYY-MM-DD-part-N-<slug>-es.html

Cada parte debe funcionar por sí sola y encajar en la historia global. La navegación anterior/siguiente debe formar una cadena correcta.

Los artículos independientes usan una URL temática estable:

    /<tema>/<slug>/
    /<tema>/<slug>/es/

Incluye series cuando el artículo pertenezca a una familia reconocible.

## Bilingüismo

Cuando exista pareja EN/ES: mismo slug y estructura conceptual; lang correcto; lang_url cruzado y recíproco; mismas secciones esenciales, ejemplos, tablas y recursos; adaptación natural del idioma; APIs, comandos e identificadores técnicos sin traducciones incorrectas.

Ninguna versión debe sentirse secundaria. Si solo existe un idioma por decisión editorial, no crees el otro automáticamente salvo petición explícita.

## Front matter

Todo post debe incluir como mínimo: layout, title, description, permalink, lang, lang_url, series, categories, subcategories, tags, date y reading_minutes. Los artículos del curso añaden part.

lang_url usa rutas absolutas desde la raíz. reading_minutes se estima sobre texto visible real a unas 200 palabras/minuto, redondeando hacia arriba y con mínimo 3. No dupliques metadatos og_* o twitter_* sin aportar una variante útil.

## SEO

- Título específico, humano y descriptivo.
- description que explique valor, no una lista de keywords.
- Un único h1 visible y jerarquía h2/h3 lógica.
- Permalink corto, descriptivo y estable.
- Categorías y tags útiles, sin keyword stuffing.
- Primera parte comprensible sin contexto externo.
- Enlaces internos cuando ayuden de verdad.

No cambies permalinks existentes salvo petición explícita.

## Enlazado interno

Cuando exista una relación real, enlaza contenido previo o posterior de forma contextual. _layouts/article.html ya aporta ruta de lectura y lecturas relacionadas; no dupliques manualmente ese bloque salvo una recomendación contextual distinta. Toda ancla debe existir y los enlaces EN ↔ ES deben ser recíprocos.

## Índice y descubrimiento obligatorio

Todo artículo nuevo debe ser descubrible desde el índice principal. Publicar en _posts/ no basta.

index.html construye el catálogo a partir de posts en español y del front matter. Comprueba que lang es es en la versión española; series/categories/subcategories/tags permiten encontrarla; título y descripción funcionan en tarjeta/carrusel; las series están conectadas; lang_url enlaza la pareja; y tras una build real la URL aparece en la portada generada.

No des por terminado un artículo que quede huérfano.
