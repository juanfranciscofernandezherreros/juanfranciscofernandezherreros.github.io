# Reglas de este repositorio: juanfranciscofernandezherreros.github.io

## Cada artículo lleva slug, nunca `part-N/` a secas

Cuando se publique un artículo nuevo (o se edite la estructura de uno
existente) en `argo-real-world-microservices/`, la ruta es siempre:

```
argo-real-world-microservices/part-N/<slug-descriptivo>/index.html
argo-real-world-microservices/part-N/<slug-descriptivo>/es/index.html
```

**Nunca** `argo-real-world-microservices/part-N/index.html` directamente
— `part-N` por sí solo no es un slug válido para un artículo.

- `part-N` da el orden de lectura dentro de la serie (se mantiene en la
  URL a petición explícita del usuario — no quitarlo).
- `<slug-descriptivo>` nombra el tema real del artículo — normalmente el
  repo del que trata (`hello-world-argocd`, `gitops-config`,
  `crud-automation`...) o, si no hay un repo concreto, una frase corta en
  kebab-case (`before-you-begin`).
- El slug es el mismo en inglés y en español — solo cambia con el sufijo
  `/es/`, igual que el resto del sitio.

Ejemplos ya en uso:

| Parte | Ruta |
| --- | --- |
| 0 | `part-0/before-you-begin/` |
| 1 | `part-1/hello-world-argocd/` |
| 2 | `part-2/gitops-config/` |
| 3 | `part-3/crud-automation/` |

Al añadir una parte nueva, actualizar también:
- El enlace de la tarjeta correspondiente en `index.html` (raíz).
- El `back-link` de la parte siguiente (si existe) y el enlace "next" de
  la parte anterior (si existe).
- `og:url` en el `<head>` del artículo nuevo.

Verificar los enlaces con resolución real de URL (no a ojo) antes de
publicar — este repo ya tiene un historial de enlaces rotos por cambiar
la profundidad de anidamiento sin recalcular las rutas relativas.
