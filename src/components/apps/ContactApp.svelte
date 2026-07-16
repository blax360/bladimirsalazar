<script lang="ts">
  let name = $state('');
  let email = $state('');
  let subject = $state('');
  let message = $state('');

  function reset() {
    name = '';
    email = '';
    subject = '';
    message = '';
  }
</script>

<div class="app-content win-scroll">
  <h1>✉️ Contacto</h1>

  <form class="contact-form" name="contact" method="POST" action="/gracias" data-netlify="true">
    <input type="hidden" name="form-name" value="contact" />
    <div>
      <label for="c-name">Nombre</label>
      <input id="c-name" class="input-win" type="text" name="name" bind:value={name} placeholder="Tu nombre" />
    </div>
    <div>
      <label for="c-email">Email</label>
      <input id="c-email" class="input-win" type="email" name="email" bind:value={email} placeholder="tu@email.com" />
    </div>
    <div>
      <label for="c-subject">Asunto</label>
      <input id="c-subject" class="input-win" type="text" name="subject" bind:value={subject} placeholder="Asunto" />
    </div>
    <div>
      <label for="c-message">Mensaje</label>
      <textarea id="c-message" class="input-win" name="message" bind:value={message} placeholder="Escribe tu mensaje..."></textarea>
    </div>
    <div class="form-actions">
      <button type="reset" class="btn-win" onclick={reset}>Limpiar</button>
      <button type="submit" class="btn-win">Enviar</button>
    </div>
  </form>

  <div style="margin-top:16px; border-top:1px solid var(--win-gray-dark); padding-top:12px;">
    <p>También puedes escribir directamente a <a href="mailto:blax360.com@gmail.com">blax360.com@gmail.com</a></p>
    <h2>Información de contacto</h2>
    <p>📧 <a href="mailto:blax360.com@gmail.com">blax360.com@gmail.com</a></p>
    <p>📍 Chile</p>
    <h3>Redes</h3>
    <div class="social-links">
      <a class="social-link" href="https://www.youtube.com/@BladimirSalazar" target="_blank" rel="noopener">
        <span>▶</span> YouTube · @BladimirSalazar
      </a>
      <a class="social-link" href="https://www.instagram.com/blax360" target="_blank" rel="noopener">
        <span>📷</span> Instagram · @blax360
      </a>
      <a class="social-link" href="https://www.imdb.com/name/nm1873474/" target="_blank" rel="noopener">
        <span>🎬</span> IMDB · nm1873474
      </a>
    </div>
  </div>
</div>