# 🔧 Guía de Configuración de Make.com

> **Automatización de publicaciones para BS-OS**
> Esta guía te explica cómo configurar Make.com para que cada vez que publiques un post en tu web, se publique automáticamente en Patreon, Instagram y YouTube.

---

## 📋 ¿Qué hace esto?

Cada vez que publicas un post nuevo en tu sitio web (bladimirsalazar.com), Make.com lee el post desde tu feed RSS y lo replica automáticamente en:

- 🟣 **Patreon** — como un post para tus patrons
- 📸 **Instagram** — como una foto con el título y descripción
- ▶️ **YouTube** — como un Community Post en tu canal

Todo esto **sin que tengas que hacer nada manualmente**. Publicas una vez en la web y se replica en todas partes. 🎉

---

## ✅ Requisitos previos

Antes de empezar, necesitas:

| Requisito | ¿Lo tienes? |
|---|---|
| Cuenta en **Make.com** (gratis hasta 1000 operaciones/mes) → https://make.com | ☐ |
| Tu web publicada con el feed RSS disponible en: `https://bladimirsalazar.com/rss.xml` | ☐ |
| Cuenta de **Patreon** (creador) con al menos un tier configurado | ☐ |
| Cuenta de **Instagram Business** (no personal) conectada a una página de Facebook | ☐ |
| Canal de **YouTube** verificado (para Community Posts) | ☐ |

> ⚠️ **Sobre Instagram:** Necesitas una cuenta de Instagram **Business** (comercial), no una personal. Si tu cuenta es personal, debes cambiarla a Business en la configuración de Instagram. También debe estar vinculada a una página de Facebook.

> ⚠️ **Sobre YouTube:** Para publicar Community Posts, tu canal debe estar verificado. La verificación se hace en https://studio.youtube.com → Ajustes → Estado y funciones → Verificar.

---

## 🚀 Paso 1: Crear el escenario en Make.com

1. Ve a **https://make.com** e inicia sesión (o regístrate si no tienes cuenta)

2. Haz clic en el botón **"Create a new scenario"** (Crear nuevo escenario) en la esquina superior derecha

3. Verás un lienzo en blanco con un signo **"+"** en el centro. Haz clic en el **"+"**

4. Busca **"RSS"** en la barra de búsqueda y selecciona el módulo **"Watch RSS feed items"** (Vigilar elementos del feed RSS)

5. Configura el módulo RSS:
   - **URL:** `https://bladimirsalazar.com/rss.xml`
   - **Limit:** `10` (número máximo de items a procesar por ejecución)
   - Haz clic en **"OK"**

6. Configura la programación (schedule):
   - Haz clic en el icono del reloj ⏰ que aparece sobre el módulo RSS
   - Selecciona **"15 minutes"** (cada 15 minutos)
   - Esto significa que Make.com revisará tu feed RSS cada 15 minutos buscando nuevos posts

7. Haz clic en **"Run once"** (Ejecutar una vez) para probar que el módulo RSS funciona. Deberías ver un resultado verde con los datos de tu último post.

> 💡 Si el módulo RSS muestra error, verifica que `https://bladimirsalazar.com/rss.xml` esté accesible abriéndolo en tu navegador.

---

## 🟣 Paso 2: Publicar en Patreon

1. Haz clic en el módulo RSS (ya configurado) y luego en el signo **"+"** que aparece a su derecha

2. Busca **"Patreon"** y selecciona el módulo **"Create a Post"** (Crear una publicación)

3. **Conectar tu cuenta de Patreon:**
   - Haz clic en **"Add"** junto a "Connection"
   - Se abrirá una ventana de OAuth (autorización)
   - Inicia sesión en Patreon
   - Autoriza a Make.com para que pueda publicar en tu cuenta
   - Vuelve a Make.com

4. **Mapear los campos** (esto es, decirle a Make.com qué datos del RSS van en cada parte del post de Patreon):

   | Campo de Patreon | Valor a mapear |
   |---|---|
   | **Title** (Título) | `{{1.title}}` — arrastra el título desde el módulo RSS |
   | **Body** (Cuerpo del post) | `{{1.description}}` + salto de línea + `{{1.link}}` (link al post original) |
   | **Tier** (Nivel de acceso) | Selecciona el tier al que va dirigido el post |
   | **is_public** | `false` (para que solo lo vean tus patrons, no el público general) |

   Para mapear un campo, haz clic en el campo donde quieres insertar el valor y selecciona la variable del módulo anterior (aparecerá una lista desplegable con los datos disponibles del RSS).

5. Haz clic en **"OK"**

6. Prueba el módulo haciendo clic en **"Run once"**. Revisa tu Patreon para confirmar que el post se creó correctamente.

### 💡 Consejo para el cuerpo del post en Patreon:

Puedes combinar texto fijo con variables. Por ejemplo:

```
📰 Nuevo post en mi web:

{{1.title}}

{{1.description}}

Lee el artículo completo aquí: {{1.link}}
```

Esto hace que el post en Patreon se vea más completo y atractivo.

---

## 📸 Paso 3: Publicar en Instagram

1. Haz clic en el último módulo (Patreon) y luego en el signo **"+"**

2. Busca **"Instagram"** y selecciona el módulo **"Create a Photo Post"** (Crear una publicación de foto)

   > ⚠️ Este módulo requiere una cuenta de **Instagram Business**. Si tu cuenta no es Business, no aparecerá esta opción o dará error.

3. **Conectar tu cuenta de Instagram:**
   - Haz clic en **"Add"** junto a "Connection"
   - Autoriza a Make.com para acceder a tu cuenta de Instagram Business
   - Deberás iniciar sesión en Facebook e Instagram durante este proceso

4. **Configurar la imagen:**
   - Si el post del RSS tiene una imagen: usa la URL de esa imagen
   - Si el post **no tiene imagen:** usa una imagen por defecto (debes subir una imagen de respaldo a Instagram o usar una URL pública)
   
   En el campo **"Image URL"** puedes poner:
   - Una variable del RSS si el feed incluye imágenes: `{{1.image_url}}` o similar
   - Una URL fija a una imagen de respaldo alojada en tu web o en cualquier lugar público

5. **Configurar el caption (texto de la publicación):**

   | Campo de Instagram | Valor a mapear |
   |---|---|
   | **Caption** (Texto) | `{{1.title}}` + salto de línea + `{{1.description}}` + salto de línea + `{{1.link}}` |
   | **Tags** (Etiquetas) | Añade hashtags relevantes, por ejemplo: `#cine #cortometraje #bladimirsalazar` |

   Un caption recomendado sería:
   ```
   {{1.title}}
   
   {{1.description}}
   
   Lee más en: {{1.link}}
   
   #cine #cortometraje #bladimir #rodaje
   ```

6. Haz clic en **"OK"**

7. Prueba con **"Run once"** y revisa que la publicación aparezca en Instagram.

> 💡 **Nota sobre imágenes:** Instagram **requiere** una imagen para publicar. Si tu post no tiene imagen, la publicación fallará. Por eso es importante tener una imagen de respaldo. Puedes usar una imagen genérica con tu logo o una foto tuya.

---

## ▶️ Paso 4: Publicar en YouTube Community Post (opcional)

> ⚠️ Este paso requiere un canal de YouTube **verificado**. Los canales no verificados no pueden crear Community Posts.

1. Haz clic en el último módulo y luego en el signo **"+"**

2. Busca **"YouTube"** y selecciona el módulo **"Create a Community Post"** (Crear una publicación comunitaria)

   > ⚠️ Si no aparece esta opción, significa que Make.com no soporta Community Posts directamente con un módulo dedicado. En ese caso, puedes usar el módulo **"HTTP"** para hacer una llamada a la YouTube Data API manualmente, o usar un webhook. Consulta la documentación de Make.com para la opción más actualizada.

3. **Conectar tu cuenta de YouTube:**
   - Haz clic en **"Add"** junto a "Connection"
   - Autoriza a Make.com para acceder a tu canal de YouTube

4. **Configurar el texto del Community Post:**

   | Campo de YouTube | Valor a mapear |
   |---|---|
   | **Text** (Texto del post) | `{{1.title}}` + salto de línea + salto de línea + `Lee más en: {{1.link}}` |

   Ejemplo de texto:
   ```
   {{1.title}}
   
   Lee el artículo completo en: {{1.link}}
   ```

5. Haz clic en **"OK"**

6. Prueba con **"Run once"**

> 💡 **Alternativa si no hay módulo directo:** Si Make.com no tiene un módulo nativo para Community Posts de YouTube, puedes:
> 1. Usar el módulo **"HTTP" → "Make a request"** para llamar a la YouTube Data API endpoint `activities.insert`
> 2. O simplemente omitir este paso y publicar en YouTube manualmente cuando quieras

---

## 📧 Paso 5: Notificación (opcional)

Es recomendable añadir una notificación para saber cuándo se publica algo automáticamente.

### Opción A: Notificación por email

1. Haz clic en el último módulo y luego en **"+"**
2. Busca **"Email"** y selecciona **"Send an Email"**
3. Configura:
   - **To:** tu correo electrónico
   - **Subject:** `Nueva publicación automática: {{1.title}}`
   - **Content:** `Se ha publicado automáticamente "{{1.title}}" en Patreon, Instagram y YouTube.\n\nLink del post original: {{1.link}}`

### Opción B: Notificación por Discord

1. Haz clic en el último módulo y luego en **"+"**
2. Busca **"Discord"** y selecciona **"Send a Message"**
3. Necesitas crear un **Webhook** en tu servidor de Discord:
   - En Discord: Configuración del servidor → Integraciones → Webhooks → Nuevo webhook
   - Copia la URL del webhook
4. En Make.com, pega la URL del webhook
5. **Message:** `📢 Nueva publicación automática: **{{1.title}}** — publicado en Patreon, Instagram y YouTube. Ver: {{1.link}}`

---

## ▶️ Paso 6: Activar y monitorear el escenario

### Activar el escenario

1. En la parte inferior izquierda del escenario, busca el interruptor **ON/OFF**
2. Cámbialo a **ON** (se pondrá verde)
3. El escenario ahora se ejecutará automáticamente cada 15 minutos

### Monitorear las ejecuciones

1. En la parte inferior, haz clic en el icono de **historial** (parece una lista)
2. Aquí verás todas las ejecuciones del escenario:
   - 🟢 **Verde:** ejecución exitosa
   - 🔴 **Rojo:** ejecución con errores
3. Si una ejecución tiene errores, haz clic en ella para ver los detalles

### Manejar errores

Si un módulo falla, Make.com te mostrará el error. Los más comunes:

| Error | Causa probable | Solución |
|---|---|---|
| `Unauthorized` / `401` | Token o credencial expirado | Volver a conectar la cuenta (re-autorizar OAuth) |
| `Rate limit` / `429` | Demasiadas peticiones en poco tiempo | Aumentar el intervalo de ejecución (ej: 30 min) |
| `Permission denied` | La cuenta no tiene permisos suficientes | Verificar que la cuenta es Business / está verificada |
| `Invalid image URL` | La imagen del post no es accesible | Usar una imagen de respaldo válida |
| `Module not configured` | Falta mapear un campo obligatorio | Revisar la configuración del módulo |

> 💡 Make.com permite configurar **rutas de manejo de errores**. Puedes hacer que si un módulo falla, envíe un email de alerta en lugar de detener todo el escenario. Para esto, haz clic derecho en un módulo → "Add error handler".

---

## ⚠️ Limitaciones importantes

### Make.com (plan gratuito)
- **1000 operaciones por mes** (gratis)
- Cada publicación completa (RSS + Patreon + Instagram + YouTube + Notificación) consume aproximadamente **3-5 operaciones**
- Si publicas ~10 posts al mes, gastarías ~30-50 operaciones → sobra espacio
- Si publicas muchos posts, considera el plan Pro ($10.59/mes para 10,000 ops)

### Instagram Graph API
- Límite: **200 llamadas por hora** por app
- Los tokens de acceso **expiran cada 60 días** → debes refrescarlos
- Para refrescar: ve a Make.com → conexión de Instagram → "Reauthorize" antes de que expire

### YouTube Data API
- Límite: **10,000 unidades por día** (por proyecto)
- Un Community Post consume ~50-70 unidades
- Es muy difícil llegar al límite con publicaciones normales

### Patreon API
- Sin límite estricto documentado, pero usa sentido común
- No publiques más de unos pocos posts por hora

---

## 🔧 Troubleshooting (solución de problemas)

### "No se publica nada en ninguna plataforma"

1. **Verifica que el escenario esté activado** (interruptor en ON)
2. **Verifica que el feed RSS funcione:** abre `https://bladimirsalazar.com/rss.xml` en tu navegador. ¿Ves tu último post?
3. **Revisa el historial de ejecuciones** en Make.com. ¿Hay errores?
4. **Revisa las credenciales:** ¿Todas las cuentas están conectadas? (Patreon, Instagram, YouTube)
5. **Verifica la programación:** ¿Está configurado cada 15 minutos?

### "Instagram falla"

1. **Token expirado:** Los tokens de Instagram Graph API expiran cada 60 días. Ve a Make.com → conexión de Instagram → **"Reauthorize"**
2. **Cuenta no es Business:** Verifica en Instagram → Configuración → Tipo de cuenta que sea "Comercial / Business"
3. **Sin imagen:** Instagram requiere imagen. Asegúrate de que el post tenga imagen o de que tengas una imagen de respaldo configurada
4. **Facebook desvinculado:** Tu Instagram Business debe estar vinculado a una página de Facebook. Verifica en Configuración de Instagram → Empresa → Página de Facebook vinculada

### "YouTube falla"

1. **Canal no verificado:** Ve a YouTube Studio → Ajustes → Estado y funciones → Verificar canal
2. **Sin permisos:** Asegúrate de que autorizaste a Make.com con permisos de escritura
3. **Módulo no disponible:** Si Make.com no tiene módulo nativo para Community Posts, usa el módulo HTTP con la YouTube Data API

### "Patreon falla"

1. **No hay tier configurado:** Necesitas al menos un tier creado en Patreon
2. **Token expirado:** Re-autoriza la conexión OAuth en Make.com
3. **No eres creador:** Verifica que tu cuenta de Patreon sea de creador (creator), no de patron

### "Make.com se queda sin operaciones"

- Estás en el plan gratuito (1000 ops/mes)
- Reduce la frecuencia de revisión del RSS (de 15 min a 30 min o 1 hora)
- Considera desactivar la notificación de email (consume una operación extra)
- Si necesitas más, actualiza a un plan de pago

### "El feed RSS no tiene la imagen del post"

- Verifica que tus posts en Markdown tengan una imagen en el frontmatter o en el cuerpo
- Si el feed no incluye imágenes, configura una **imagen por defecto** en el módulo de Instagram
- Puedes subir una imagen genérica (tu logo o una imagen de marca) a tu web y usar esa URL fija

---

## 📊 Resumen del flujo

```
Publicas en la web (Markdown)
        ↓
Feed RSS se actualiza automáticamente
        ↓
Make.com detecta el nuevo post (cada 15 min)
        ↓
┌───────────┬──────────────┬──────────────┐
│           │              │              │
Patreon   Instagram     YouTube        Email
(post)   (foto + texto) (community)  (notificación)
```

---

## 💡 Consejos finales

1. **Prueba con un post de prueba** antes de activar el escenario permanentemente. Crea un post de prueba en tu web y verifica que se replica en todas las plataformas.

2. **Revisa las publicaciones automáticas** durante las primeras semanas para asegurarte de que se vean bien en cada plataforma.

3. **Refresca los tokens** de Instagram cada 50-55 días para que no expiren.

4. **No publiques demasiados posts de golpe.** Make.com los procesará, pero las plataformas podrían marcarlo como spam. Un ritmo de 2-3 posts por semana es sano.

5. **Personaliza el caption para cada plataforma.** Lo que funciona en Instagram (con emojis y hashtags) puede no funcionar igual en Patreon. Considera crear rutas diferentes en Make.com si quieres personalizar el mensaje para cada una.

---

> 🎬 **Hecho para Bladimir Salazar.** Si tienes problemas con esta configuración, revisa primero la sección de Troubleshooting. Si persiste, contacta a quien te configuró inicialmente el sistema.