<script lang="ts">
  interface Props {
    onOpenApp: (appId: string, props?: Record<string, any>) => void;
    onClose: () => void;
  }

  let { onOpenApp, onClose }: Props = $props();

  function open(appId: string, props?: Record<string, any>) {
    onOpenApp(appId, props);
    onClose();
  }

  function openUrl(url: string) {
    window.open(url, '_blank', 'noopener');
    onClose();
  }

  function itemProps(action: () => void) {
    return {
      role: 'menuitem',
      tabindex: 0,
      onclick: action,
      onkeydown: (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          action();
        }
      },
    };
  }
</script>

<div
  class="start-menu"
  onclick={(e) => e.stopPropagation()}
  onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
  role="menu"
  tabindex="-1"
>
  <div class="start-menu-header">
    <span style="display:flex; align-items:center; justify-content:center; width:20px; height:20px; background:var(--win-blue); color:var(--win-white); font-weight:bold; font-size:12px;">BS</span>
    <span>BS-OS</span>
  </div>

  <div class="start-menu-list">
    <div class="start-menu-item" {...itemProps(() => open('mediaplayer'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">📺</span>
      <span>Reproductor de video</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => open('about'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">🧑</span>
      <span>Sobre Mí</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => open('projects'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">📂</span>
      <span>Proyectos</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => open('blog'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">📝</span>
      <span>Blog</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => open('contact'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">✉️</span>
      <span>Contacto</span>
    </div>

    <div class="start-menu-separator"></div>

    <div class="start-menu-item" {...itemProps(() => open('presskit'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">📋</span>
      <span>Press Kit</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => open('resources'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">🎨</span>
      <span>Recursos</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => open('galaga'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">🎬</span>
      <span>Film Boss</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => openUrl('https://www.youtube.com/@BladimirSalazar'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">▶</span>
      <span>YouTube</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => openUrl('https://www.patreon.com/blax360'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">❤</span>
      <span>Patreon</span>
    </div>

    <div class="start-menu-separator"></div>

    <div class="start-menu-item" {...itemProps(() => open('help'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">❓</span>
      <span>Ayuda</span>
    </div>
    <div class="start-menu-item" {...itemProps(() => open('shutdown'))}>
      <span class="start-menu-item-icon" style="display:flex; align-items:center; justify-content:center;">⏻</span>
      <span>Apagar...</span>
    </div>
  </div>
</div>