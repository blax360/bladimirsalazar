<script lang="ts">
  // Los recursos ya NO están escritos aquí a mano.
  // Se leen automáticamente de los archivos en src/content/resources/*.md
  // Para publicar un recurso nuevo cada semana solo hay que crear un .md ahí.
  interface Resource {
    id: string;
    title: string;
    description: string;
    category: 'Tutoriales' | 'Descargas' | 'Assets';
    tags: string[];
    date: string;
    aiGenerated: boolean;
    link?: string;
    manualLink?: string;
  }

  interface Props {
    resources?: Resource[];
    onOpenWindow?: (appId: string, props?: Record<string, any>) => void;
  }

  let { resources = [], onOpenWindow }: Props = $props();

  const PATREON_URL = 'https://www.patreon.com/blax360';
  const KOFI_URL = 'https://ko-fi.com/blax360';

  type Filter = 'Todos' | 'Tutoriales' | 'Descargas' | 'Assets';

  let activeFilter = $state<Filter>('Todos');

  let filteredResources = $derived(
    activeFilter === 'Todos'
      ? resources
      : resources.filter((r) => r.category === activeFilter)
  );

  const filters: Filter[] = ['Todos', 'Tutoriales', 'Descargas', 'Assets'];
</script>

<div class="app-content win-scroll">
  <h1>🎨 Recursos</h1>
  <p style="margin-bottom: 12px;">
    Cada semana comparto recursos gratuitos para la comunidad filmmaker: tutoriales,
    descargas y assets.
  </p>

  <div class="filters" style="display: flex; gap: 4px; margin-bottom: 16px; flex-wrap: wrap;">
    {#each filters as f}
      <button
        class="btn-win"
        class:active={activeFilter === f}
        onclick={() => (activeFilter = f)}
        style={activeFilter === f
          ? 'border-style: inset; background: var(--win-button-face-active, #d4d0c8); box-shadow: inset 1px 1px 0 #808080;'
          : ''}
      >
        {f}
      </button>
    {/each}
  </div>

  <div class="projects-grid">
    {#each filteredResources as r (r.id)}
      <div class="project-card">
        <div class="project-card-category">{r.category} · {r.date}</div>
        <div class="project-card-title">{r.title}</div>
        {#if r.aiGenerated}
          <span
            style="display: inline-block; background: #000080; color: #fff; font-size: 11px; padding: 1px 6px; margin: 4px 0; border: 1px solid #000; font-weight: bold; align-self: flex-start;"
          >IA</span>
        {/if}
        <div class="project-card-desc">{r.description}</div>
        {#if r.tags && r.tags.length > 0}
          <div style="font-size: 12px; color: #666; margin-top: 4px;">
            {r.tags.join(', ')}
          </div>
        {/if}
        {#if r.link || r.manualLink}
          <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
            {#if r.link}
              <a class="btn-win" href={r.link} target="_blank" rel="noopener" style="text-decoration: none;">Descargar / Ver</a>
            {/if}
            {#if r.manualLink}
              <a class="btn-win" href={r.manualLink} target="_blank" rel="noopener" style="text-decoration: none;">Manual de uso</a>
            {/if}
          </div>
        {/if}
        <div class="support-nudge">
          Gratis gracias a quienes apoyan en
          <a href={PATREON_URL} target="_blank" rel="noopener">Patreon</a> ❤
        </div>
      </div>
    {/each}
  </div>

  <div class="support-banner">
    <strong>¿Te sirvió alguno de estos recursos?</strong><br />
    Todo lo que comparto aquí es gratis y lo seguirá siendo. Si quieres ayudar a que
    siga creando, puedes apoyarme en
    <a href={PATREON_URL} target="_blank" rel="noopener">Patreon</a> (apoyo mensual) o
    <a href={KOFI_URL} target="_blank" rel="noopener">invitarme un café en Ko-Fi</a> (aporte único).
    Sin presión — con compartir el recurso ya me ayudas un montón.
  </div>
</div>
