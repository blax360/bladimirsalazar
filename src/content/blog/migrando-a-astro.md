---
title: "Migrando de Astro a Vanilla JS con Canvas"
date: 2026-02-25
contentType: markdown
category: "Desarrollo Web"
author: "Bladimir Salazar"
description: "Por qué temporalmente abandoné Astro para construir el portafolio como una experiencia tipo Galaga usando HTML5 Canvas."
tags: ["astro", "canvas", "desarrollo"]
---

Decidí tomar un descanso de Astro/Jekyll para construir este portafolio como una experiencia tipo Galaga. La idea era usar HTML5 Canvas para dibujar la nave, pixel por pixel, corriendo a 60fps.

El desafío más grande fue hacer coexistir el DOM y el Canvas — necesitaba que las balas del juego detectaran colisión con los elementos del menú HTML usando `getBoundingClientRect()`. Fue un experimento fascinante que me enseñó mucho sobre cómo el navegador posiciona elementos.

Ahora, con BS-OS, vuelvo a Astro pero conservando ese espíritu de experimentación visual. El escritorio Windows 3.1 es el lienzo, y cada "app" es una ventana a mi trabajo como filmmaker.