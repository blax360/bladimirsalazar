<script lang="ts">
  let text = $state(
    `Diario de producción — Akumu Films

Día 47:
La secuencia de apertura está lista. La luz natural que entra por la ventana del set creó un efecto que no se puede replicar con ningún filtro.

A veces las mejores decisiones son las que no planeas.

— BS`
  );
  let secretFound = $state(false);
  let prevText = '';

  $effect(() => {
    if (text.toUpperCase().includes('CONGRATULATIONS') && !prevText.toUpperCase().includes('CONGRATULATIONS')) {
      secretFound = true;
    }
    prevText = text;
  });
</script>

<div class="app-content win-scroll" style="padding:0; display:flex; flex-direction:column; height:100%;">
  <div class="window-menubar">
    <div class="window-menubar-item"><u>A</u>rchivo</div>
    <div class="window-menubar-item"><u>E</u>dición</div>
    <div class="window-menubar-item"><u>A</u>yuda</div>
  </div>
  <textarea
    class="input-win"
    style="flex:1; width:100%; border:none; box-shadow:none; padding:8px; font-family:var(--win-font-mono); font-size:14px; resize:none; background:var(--win-white);"
    bind:value={text}
    spellcheck="false"
  ></textarea>
  {#if secretFound}
    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:var(--win-yellow); border:2px solid var(--win-black); padding:12px 20px; z-index:5; text-align:center;">
      <strong>🎉 FELICITACIONES</strong>
      <div style="font-size:11px; margin-top:4px;">Encontraste el secreto.</div>
      <button class="btn-win" style="margin-top:8px;" onclick={() => secretFound = false}>Cerrar</button>
    </div>
  {/if}
</div>