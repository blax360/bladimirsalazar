# 🖥️ Guía de Mantenimiento — BS-OS

> **Para Bladimir Salazar**
> Esta guía te explica cómo mantener y actualizar tu sitio web sin necesidad de saber programar.
> Si puedes usar Word, puedes usar esto. 😊

---

## 📋 ¿Qué es BS-OS?

BS-OS es tu sitio web personal. Se ve como un escritorio de Windows 3.1 antiguo, con ventanas, iconos y un menú de inicio. Es una forma divertida y nostálgica de presentar tu trabajo como cineasta.

El sitio se construye con una herramienta llamada **Astro** (no te preocupes, no tienes que tocar eso). Tú solo necesitas editar archivos de texto plano con un formato llamado **Markdown**, que es más fácil de lo que suena.

---

## 📁 Estructura del proyecto (lo que necesitas saber)

Piensa en el proyecto como una carpeta con muchas subcarpetas. Estas son las que te importan:

### ✅ Carpetas que SÍ debes tocar (seguras):

| Carpeta / Archivo | ¿Para qué sirve? |
|---|---|
| `src/content/blog/` | Aquí están todos los posts de tu blog |
| `src/content/projects/` | Aquí están tus proyectos (cortos, videos, etc.) |
| `src/content/settings/site-config.md` | Configuración general del sitio (email, bio, redes sociales) |

### ⛔ Carpetas que NO debes tocar (a menos que sepas lo que haces):

| Carpeta | ¿Por qué no? |
|---|---|
| `src/components/` | Contiene el "código" que hace que las ventanas y el escritorio funcionen |
| `src/layouts/` | Define cómo se estructuran las páginas |
| `src/styles/` | Los estilos visuales (colores, fuentes, tamaños) |
| `astro.config.mjs` | Configuración interna del sistema |
| `package.json` | Lista de dependencias del proyecto |
| `netlify.toml` | Configuración de publicación |
| `node_modules/` | Archivos internos del sistema (¡no los abras!) |
| `dist/` | La versión compilada del sitio (se genera sola) |

> 💡 **Regla de oro:** Si no estás seguro, no lo toques. Si tienes dudas, pregunta primero.

---

## ✍️ Cómo editar el blog

### ¿Dónde están los posts?

Todos los posts del blog están en la carpeta `src/content/blog/`. Cada post es un archivo de texto con la extensión `.md` (de Markdown).

### ¿Qué es Markdown?

Markdown es una forma sencilla de darle formato a un texto usando símbolos. Es como escribir en cualquier editor, pero con unos truquitos:

| Quieres... | Escribes... | Resultado |
|---|---|---|
| Un título grande | `# Mi título` | **Mi título** (en grande) |
| Un subtítulo | `## Subtítulo` | **Subtítulo** (mediano) |
| Negrita | `**texto en negrita**` | **texto en negrita** |
| Cursiva | `*texto en cursiva*` | *texto en cursiva* |
| Una lista | `- Item uno`<br>`- Item dos` | • Item uno<br>• Item dos |
| Un enlace | `[texto](https://url.com)` | [texto](https://url.com) (clickeable) |
| Una imagen | `![descripción](https://url.com/imagen.jpg)` | Muestra la imagen |
| Una línea separadora | `---` | ───────── |
| Una cita | `> Texto citado` | > Texto citado |

> 💡 No tienes que memorizar todo esto. Puedes tener esta tabla a mano cuando escribas.

### Estructura de un post

Cada archivo `.md` tiene dos partes:

```
---
title: "Título de mi post"
date: "2025-01-15"
contentType: "markdown"
category: "Cine"
tags: ["rodaje", "directo", "opinión"]
description: "Una breve descripción que aparece en la lista y en SEO."
---

Aquí va el contenido del post en Markdown.
Puedes escribir todo lo que quieras.
```

#### ¿Qué significa cada cosa?

| Campo | ¿Qué es? | Ejemplo |
|---|---|---|
| `title` | El título del post | `"Mi primer cortometraje"` |
| `date` | La fecha de publicación (formato AÑO-MES-DÍA) | `"2025-06-28"` |
| `contentType` | El tipo de contenido (ver abajo) | `"markdown"` |
| `category` | La categoría del post | `"Cine"`, `"Vlog"`, `"Noticias"` |
| `tags` | Palabras clave (etiquetas) entre corchetes | `["rodaje", "directo"]` |
| `description` | Resumen breve (aparece en listados y Google) | `"Breve descripción..."` |

> ⚠️ **Importante:** Las tres rayitas `---` al inicio y al final son obligatorias. Todo lo que está entre ellas se llama **frontmatter** (encabezado). No las borres.

### 📝 Tipos de contenido (`contentType`)

Puedes crear diferentes tipos de posts cambiando el valor de `contentType`:

#### 1. `markdown` — Artículo de blog normal

```markdown
---
title: "Mi experiencia rodando en la montaña"
date: "2025-06-28"
contentType: "markdown"
category: "Cine"
tags: ["rodaje", "naturaleza"]
description: "Cómo fue rodar a 3000 metros de altura."
---

Texto del artículo aquí...
```

#### 2. `youtube` — Insertar un video de YouTube

```markdown
---
title: "Mi nuevo cortometraje"
date: "2025-06-28"
contentType: "youtube"
category: "Video"
tags: ["cortometraje"]
description: "Estrenamos nuevo corto."
videoId: "dQw4w9WgXcQ"
---

Breve descripción o comentario sobre el video.
```

> 💡 El `videoId` es la parte que viene después de `v=` en la URL de YouTube.
> Ejemplo: `https://youtube.com/watch?v=dQw4w9WgXcQ` → `videoId: "dQw4w9WgXcQ"`

#### 3. `instagram` — Insertar un post de Instagram

```markdown
---
title: "Foto de rodaje"
date: "2025-06-28"
contentType: "instagram"
category: "Foto"
tags: ["rodaje", "foto"]
description: "Un momento del rodaje."
instagramUrl: "https://www.instagram.com/p/CxYzAbCdEfG/"
---

Comentario sobre la foto.
```

### 🆕 Cómo crear un post nuevo (paso a paso)

1. **Abre la carpeta** `src/content/blog/`
2. **Copia un post existente** que se parezca al que quieres crear (por ejemplo, copia un post de tipo `markdown` si vas a escribir un artículo)
3. **Renombra el archivo copiado** con un nombre claro, por ejemplo: `2025-06-28-mi-nuevo-post.md`
   - Usa minúsculas
   - Usa guiones `-` en lugar de espacios
   - Pon la fecha al inicio ayuda a ordenarlos
4. **Abre el archivo** con cualquier editor de texto (TextEdit, VS Code, Notepad++)
5. **Cambia el frontmatter:**
   - `title`: el título real de tu post
   - `date`: la fecha de hoy (formato `AAAA-MM-DD`)
   - `contentType`: `markdown`, `youtube` o `instagram`
   - `category`, `tags`, `description`: lo que corresponda
6. **Borra el contenido viejo** (lo que está después del segundo `---`)
7. **Escribe tu nuevo contenido** en Markdown
8. **Guarda el archivo** (Cmd+S en Mac, Ctrl+S en Windows)

¡Listo! El post aparecerá automáticamente en tu sitio. 🎉

> 💡 **Consejo:** Siempre revisa cómo se ve en el navegador antes de publicar (ver sección "Cómo ejecutar el sitio localmente").

---

## 🎬 Cómo editar proyectos

Tus proyectos (cortometrajes, videos, etc.) están en la carpeta `src/content/projects/`. Cada proyecto es un archivo `.md` con esta estructura:

```markdown
---
title: "El Último Verano"
category: "Cortometraje"
description: "Un corto sobre la pérdida y la memoria."
link: "https://youtube.com/watch?v=xxxxxxx"
year: "2024"
role: "Director, Guionista"
featured: true
---

Aquí puedes poner más detalles del proyecto si quieres.
```

### Campos de un proyecto:

| Campo | ¿Qué es? | Ejemplo |
|---|---|---|
| `title` | Nombre del proyecto | `"El Último Verano"` |
| `category` | Tipo de proyecto | `"Cortometraje"`, `"Largometraje"`, `"Vlog"`, `"Documental"` |
| `description` | Descripción breve | `"Un corto sobre..."` |
| `link` | URL donde se puede ver (YouTube, Vimeo, etc.) | `"https://..."` |
| `year` | Año de realización | `"2024"` |
| `role` | Tu rol en el proyecto | `"Director, Guionista"` |
| `featured` | Si se muestra destacado en la página principal | `true` o `false` |

### Cómo crear un proyecto nuevo:

1. Ve a `src/content/projects/`
2. Copia un archivo existente
3. Renómbralo (ej: `el-ultimo-verano.md`)
4. Cambia los campos del frontmatter
5. Guarda

¡Listo! El proyecto aparecerá en la sección de proyectos. 🎥

---

## ⚙️ Cómo editar la configuración del sitio

El archivo `src/content/settings/site-config.md` contiene toda la configuración general. Aquí puedes cambiar:

- **Tu email de contacto**
- **Tu biografía** (el texto que aparece en tu perfil)
- **Links a redes sociales** (Instagram, YouTube, Vimeo, etc.)
- **Los mensajes de error personalizados** (los textos de las ventanas de error del escritorio)
- **El fondo del escritorio** (`wallpaper`)
- **El video que se abre al entrar al sitio** (`showreelYoutubeId` y `showreelTitle`)

### Cómo editarlo:

1. Abre `src/content/settings/site-config.md`
2. Cambia los valores que quieras
3. Guarda el archivo

> ⚠️ No cambies los nombres de los campos (lo que está antes de los dos puntos `:`), solo los valores (lo que está después).

### 🖼️ Cambiar el fondo del escritorio (wallpaper)

El escritorio puede mostrar un fotograma de tus películas como fondo (muy recomendado: es lo primero que ve un visitante).

1. Elige una imagen horizontal de buena calidad (ideal: 1920×1080, formato `.jpg`)
2. Guárdala en la carpeta `public/assets/` con un nombre simple, ej: `wallpaper.jpg`
3. En `site-config.md` escribe: `wallpaper: "/assets/wallpaper.jpg"`
4. Guarda. Si lo dejas vacío (`wallpaper: ""`), vuelve el fondo verde azulado clásico.

### 📺 Cambiar el video de bienvenida (Reproductor de video)

Al entrar al sitio se abre una ventana "Reproductor de video" con un video tuyo de YouTube (sin sonido, para no molestar).

1. Copia la URL de tu video, ej: `https://www.youtube.com/watch?v=9gmG5BVaHT8`
2. El ID es lo que va después de `watch?v=` → `9gmG5BVaHT8`
3. En `site-config.md` escribe:
   - `showreelYoutubeId: "9gmG5BVaHT8"`
   - `showreelTitle: "El título que quieras mostrar"`
4. Si dejas `showreelYoutubeId` vacío, el reproductor no se abre solo (pero sigue disponible en el icono "Showreel" del escritorio y el menú Inicio).

> 💡 Cuando tengas tu showreel definitivo, súbelo a YouTube (puede ser como video oculto/no listado) y pon su ID aquí.

---

## 💻 Cómo ejecutar el sitio localmente (para ver cambios antes de publicar)

Antes de publicar, es recomendable ver cómo se ve el sitio en tu navegador. Para eso necesitas ejecutarlo en tu computadora.

### Requisitos previos (una sola vez):
- Tener instalado **Node.js** (descárgalo de https://nodejs.org — elige la versión LTS)
- Tener un editor de texto (recomendado: **VS Code** — https://code.visualstudio.com)

### Pasos:

1. **Abre la Terminal** (en Mac: Cmd + Espacio, escribe "Terminal" y dale Enter)

2. **Ve a la carpeta del proyecto.** Escribe esto y dale Enter (cambia la ruta por la tuya):
   ```
   cd "/Users/blax360/Library/CloudStorage/GoogleDrive-bladimir.salazar@gmail.com/Mi unidad/10 - PROYECTOS/10.22 - Zelda_Jekyll_Website/bs-os"
   ```

3. **Instala las dependencias** (solo la primera vez o si alguien actualizó el proyecto):
   ```
   npm install
   ```

4. **Inicia el servidor de desarrollo:**
   ```
   npm run dev
   ```

5. **Abre tu navegador** y ve a:
   ```
   http://localhost:4321
   ```

6. Ahora puedes ver tu sitio. Cada vez que guardes un archivo, el sitio se actualizará solo. 🔄

### Para detener el servidor:

- Presiona `Ctrl + C` en la Terminal

### Para generar la versión publicable:

- Escribe:
  ```
  npm run build
  ```
- Esto creará/actualizará la carpeta `dist/` con el sitio listo para subir

---

## 🚀 Cómo publicar el sitio (deploy)

Tienes dos opciones:

### Opción A: Automática (recomendada) 🤖

Si el proyecto está conectado a **GitHub** y **Netlify**, el sitio se publica automáticamente cuando subes cambios a GitHub.

1. Haz tus cambios en los archivos
2. Súbelos a GitHub (git push)
3. Netlify detecta el cambio y reconstruye el sitio automáticamente
4. En unos minutos estará en vivo en tu dominio

> 💡 Si no sabes cómo usar Git/GitHub, pregunta a quien te configuró el proyecto.

### Opción B: Manual 📦

Si prefieres hacerlo a mano:

1. Ejecuta `npm run build` en la Terminal
2. Se creará/actualizará la carpeta `dist/`
3. Ve a https://app.netlify.com
4. Arrastra la carpeta `dist/` a la zona de "Drag and drop your site output folder here"
5. ¡Listo! El sitio se actualiza

---

## 🥚 Easter eggs (secretos ocultos en el sitio)

El sitio tiene varios secretos divertidos. Aquí están todos para que los conozcas (y puedas mostrarlos o mantenerlos ocultos):

| Easter egg | Cómo activarlo | Qué pasa |
|---|---|---|
| 🕹️ **Konami Code** | Presiona esta secuencia de teclas: `↑ ↑ ↓ ↓ ← → ← → B A` | Aparece el icono de **Galaga** en el escritorio |
| 💥 **Blue Screen of Death** | Haz **triple clic** en la esquina superior izquierda del escritorio | Aparece la clásica pantalla azul de error de Windows |
| 🖥️ **Protector de pantalla** | No toques nada durante **2 minutos** | Se activa un protector de pantalla estilo retro |
| 📝 **Mensaje secreto en Bloc de Notas** | Abre el Bloc de Notas en el escritorio y escribe la palabra `CONGRATULATIONS` | Aparece un mensaje secreto |
| 🔌 **Apagar el sistema** | Menú Start → Apagar (Shut Down) | Aparece la pantalla de "Ahora puedes apagar el equipo con seguridad" |

> 💡 Estos secretos están pensados para que tus visitantes los descubran. ¡Son parte de la diversión del sitio!

---

## 🔌 Configurar APIs (opcional — avanzado)

El sitio puede conectarse a YouTube e Instagram para mostrar contenido automáticamente. Esto es opcional y requiere configuración técnica.

### YouTube Data API

1. Ve a **Google Cloud Console**: https://console.cloud.google.com
2. Crea un proyecto nuevo (o usa uno existente)
3. Habilita la **YouTube Data API v3**
4. Crea una **API Key** (credenciales)
5. Copia la API key
6. Abre el archivo `.env` en la raíz del proyecto
7. Pega la key así:
   ```
   YOUTUBE_API_KEY=tu_api_key_aqui
   ```
8. Guarda el archivo

### Instagram Graph API

1. Necesitas una **cuenta de Instagram Business** conectada a una **página de Facebook**
2. Ve a **Facebook for Developers**: https://developers.facebook.com
3. Crea una app
4. Obtén un **token de acceso** (Access Token)
5. Abre el archivo `.env`
6. Pega el token:
   ```
   INSTAGRAM_ACCESS_TOKEN=tu_token_aqui
   ```
7. Guarda el archivo

> 📖 Para instrucciones más detalladas, revisa el archivo **SETUP_GUIDE.md** en la raíz del proyecto (si existe).

> ⚠️ **Importante:** Nunca compartas el contenido del archivo `.env` con nadie ni lo subas a GitHub. Contiene claves privadas.

---

## 🆘 ¿Dónde obtener ayuda?

Si algo se rompe o no funciona como esperabas:

### 1. Revisa la consola del navegador
- Abre el sitio en tu navegador
- Presiona **F12** (o Cmd+Opción+J en Mac)
- Ve a la pestaña **Console**
- Si hay errores, aparecerán en rojo
- Copia el error y muéstraselo a quien te ayuda con el sitio

### 2. Revisa los logs de build
- Si al ejecutar `npm run build` hay errores, la Terminal te mostrará mensajes en rojo
- Lee el mensaje: suele indicar qué archivo tiene el problema y en qué línea
- Los errores más comunes son:
  - **Errores de sintaxis en Markdown:** falta un `---`, un `:` o unas comillas `"`
  - **Fechas mal formateadas:** deben ser `AAAA-MM-DD` (ej: `2025-06-28`)
  - **Campos obligatorios faltantes:** falta `title` o `date`

### 3. Contacta a quien te configuró el sitio
- Si no puedes resolver el problema, contacta a la persona que te ayudó a crear o configurar el sitio
- Proporciona:
  - Qué intentabas hacer
  - Qué esperabas que pasara
  - Qué pasó en realidad
  - Captura de pantalla del error (si aplica)

### 4. Recursos útiles
- **Markdown cheat sheet:** https://www.markdownguide.org/cheat-sheet/
- **Documentación de Astro (avanzado):** https://docs.astro.build
- **Netlify (publicación):** https://docs.netlify.com

---

## 📌 Resumen rápido de tareas comunes

| Quiero... | Qué hago |
|---|---|
| Escribir un post nuevo | Copiar un `.md` en `src/content/blog/`, cambiar el contenido |
| Editar un post existente | Abrir el `.md` correspondiente y cambiar el texto |
| Añadir un proyecto | Copiar un `.md` en `src/content/projects/`, cambiar los datos |
| Cambiar mi email o bio | Editar `src/content/settings/site-config.md` |
| Cambiar mis redes sociales | Editar `src/content/settings/site-config.md` |
| Ver cómo se ve antes de publicar | `npm run dev` en la Terminal y abrir `localhost:4321` |
| Publicar cambios | Subir a GitHub (automático) o arrastrar `dist/` a Netlify |

---

> 🎬 **Hecho con cariño para Bladimir.** Si tienes dudas, no tengas miedo de preguntar. Es mejor preguntar antes que romper algo. ¡Pero tranquilo, casi todo se puede arreglar!