<script lang="ts">
  interface Props {
    focus?: 'youtube' | 'patreon' | 'instagram' | 'imdb';
  }

  let { focus = 'youtube' }: Props = $props();
</script>

<div class="app-content win-scroll">
  <h1>🔗 Redes Sociales</h1>

  <div class="social-links">
    <a class="social-link" href="https://www.youtube.com/@BladimirSalazar" target="_blank" rel="noopener">
      <svg class="social-link-icon" viewBox="0 0 24 24" fill="#cc0000"><path d="M8 5v14l11-7z"/></svg>
      <div>
        <div style="font-weight:bold;">YouTube</div>
        <div style="font-size:12px; color:var(--win-text-disabled);">@BladimirSalazar · Tutoriales Blender y contenido creativo</div>
      </div>
    </a>

    <a class="social-link" href="https://www.patreon.com/blax360" target="_blank" rel="noopener">
      <svg class="social-link-icon" viewBox="0 0 24 24" fill="#f96854"><circle cx="8" cy="12" r="6"/><rect x="14" y="6" width="3" height="12"/></svg>
      <div>
        <div style="font-weight:bold;">Patreon</div>
        <div style="font-size:12px; color:var(--win-text-disabled);">patreon.com/blax360 · Apoya la creación</div>
      </div>
    </a>

    <a class="social-link" href="https://ko-fi.com/blax360" target="_blank" rel="noopener">
      <svg class="social-link-icon" viewBox="0 0 24 24" fill="#29abe0"><path d="M4 8h13a3 3 0 0 1 3 3 3 3 0 0 1-3 3h-1v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8z"/><path d="M17 10v2h.5a1 1 0 0 0 0-2H17z" fill="#fff"/></svg>
      <div>
        <div style="font-weight:bold;">Ko-Fi</div>
        <div style="font-size:12px; color:var(--win-text-disabled);">ko-fi.com/blax360 · Invítame un café (aporte único)</div>
      </div>
    </a>

    <a class="social-link" href="https://www.instagram.com/blax360" target="_blank" rel="noopener">
      <svg class="social-link-icon" viewBox="0 0 24 24" fill="#cc0099"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="#cc0099" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="#cc0099" stroke-width="2"/><circle cx="17" cy="7" r="1.5"/></svg>
      <div>
        <div style="font-weight:bold;">Instagram</div>
        <div style="font-size:12px; color:var(--win-text-disabled);">@blax360 · Behind the scenes</div>
      </div>
    </a>

    <a class="social-link" href="https://www.imdb.com/name/nm1873474/" target="_blank" rel="noopener">
      <svg class="social-link-icon" viewBox="0 0 24 24" fill="#000000"><rect x="3" y="6" width="18" height="12" fill="#000"/><text x="12" y="15" font-size="9" font-weight="bold" fill="#f5c518" text-anchor="middle">IMDb</text></svg>
      <div>
        <div style="font-weight:bold;">IMDB</div>
        <div style="font-size:12px; color:var(--win-text-disabled);">nm1873474 · Filmografía</div>
      </div>
    </a>
  </div>

  {#if focus === 'patreon'}
    <div class="support-banner">
      <p style="font-weight:bold; margin-bottom:4px;">Apoya el proyecto ❤</p>
      <p style="margin-bottom:0;">
        Todo lo que creo — la serie, los tutoriales y los recursos semanales — es gratis
        y seguirá siéndolo. Si te gusta lo que hago, puedes ayudarme con un apoyo mensual en
        <a href="https://www.patreon.com/blax360" target="_blank" rel="noopener">Patreon</a>
        o un aporte único en
        <a href="https://ko-fi.com/blax360" target="_blank" rel="noopener">Ko-Fi</a>.
      </p>
    </div>
  {/if}

</div>