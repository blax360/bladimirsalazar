#!/bin/bash
#
# publicar.command — Publica el sitio de la Corporación Padre Patricio.
#
# Cómo usarlo:
#   • Doble clic en este archivo desde Finder, O
#   • En Terminal:  ./publicar.command   (o)   npm run publicar
#
# Qué hace: sincroniza con GitHub, guarda tus cambios y los sube.
# Netlify detecta la subida y publica el sitio solo en 1-2 minutos.
#

cd "$(dirname "$0")" || exit 1

echo "======================================"
echo "   Publicar sitio CPPE"
echo "======================================"
echo ""

# 1. Traer los últimos cambios del repositorio (evita conflictos)
echo "-> Sincronizando con GitHub..."
if ! git pull --no-edit; then
  echo ""
  echo "!!  Hubo un problema al sincronizar. Revisa el mensaje de arriba antes de seguir."
  read -r -p "Presiona Enter para cerrar..."
  exit 1
fi
echo ""

# 2. ¿Hay algo nuevo para publicar?
if [ -z "$(git status --porcelain)" ]; then
  echo "OK  No hay cambios nuevos. El sitio ya está al día."
  read -r -p "Presiona Enter para cerrar..."
  exit 0
fi

# 3. Mostrar qué cambió
echo "Cambios detectados:"
git status --short
echo ""

# 4. Pedir una descripción breve
read -r -p "Describe brevemente el cambio (Enter = usar fecha/hora): " MSG
if [ -z "$MSG" ]; then
  MSG="Actualización $(date '+%Y-%m-%d %H:%M')"
fi

# 5. Guardar y subir
git add -A
git commit -m "$MSG"
echo ""
echo "-> Subiendo a GitHub..."
if git push; then
  echo ""
  echo "======================================"
  echo "OK  Publicado. Netlify actualizará el sitio en 1-2 minutos."
  echo "    Estado de la publicacion:  https://app.netlify.com"
  echo "    Sitio en vivo:             https://melodic-genie-ee9b6c.netlify.app"
  echo "======================================"
else
  echo ""
  echo "!!  No se pudo subir. Revisa el mensaje de arriba (puede ser conexion o permisos)."
fi

echo ""
read -r -p "Presiona Enter para cerrar..."
