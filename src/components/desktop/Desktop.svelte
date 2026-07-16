<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Window from './Window.svelte';
  import Taskbar from './Taskbar.svelte';
  import StartMenu from './StartMenu.svelte';
  import DesktopIcon from './DesktopIcon.svelte';
  import ScreenSaver from './ScreenSaver.svelte';
  import BSoD from './BSoD.svelte';
  import ErrorDialog from './ErrorDialog.svelte';

  import AboutApp from '../apps/AboutApp.svelte';
  import ProjectsApp from '../apps/ProjectsApp.svelte';
  import BlogApp from '../apps/BlogApp.svelte';
  import BlogPostApp from '../apps/BlogPostApp.svelte';
  import ContactApp from '../apps/ContactApp.svelte';
  import SocialApp from '../apps/SocialApp.svelte';
  import PressKitApp from '../apps/PressKitApp.svelte';
  import ResourcesApp from '../apps/ResourcesApp.svelte';
  import GalagaApp from '../apps/GalagaApp.svelte';
  import HelpApp from '../apps/HelpApp.svelte';
  import NotepadApp from '../apps/NotepadApp.svelte';
  import MediaPlayerApp from '../apps/MediaPlayerApp.svelte';

  interface WindowState {
    id: string;
    title: string;
    icon: string;
    component: any;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    minimized: boolean;
    maximized: boolean;
    props?: Record<string, any>;
  }

  interface DesktopIconDef {
    id: string;
    label: string;
    icon: string;
    x: number;
    y: number;
    appId: string;
    title: string;
    props?: Record<string, any>;
    hidden?: boolean;
  }

  interface Props {
    resources?: any[];
    config?: Record<string, any>;
  }

  let { resources = [], config = {} }: Props = $props();

  let windows = $state<WindowState[]>([]);
  let activeWindowId = $state<string | null>(null);
  let startMenuOpen = $state(false);
  let zCounter = $state(100);
  let showBSoD = $state(false);
  let showScreenSaver = $state(false);
  let showShutdown = $state(false);
  let lastActivity = $state(Date.now());
  let isMobile = $state(false);

  let dialog = $state<{ title: string; message: string; icon: string } | null>(null);

  let konamiUnlocked = $state(false);
  let konamiNotification = $state('');

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  let cornerClicks = 0;
  let cornerTimer: ReturnType<typeof setTimeout> | null = null;

  let winCounter = 0;

  const appRegistry: Record<string, { title: string; icon: string; component: any; width: number; height: number }> = {
    about: { title: 'Sobre Mí', icon: '🧑', component: AboutApp, width: 460, height: 400 },
    projects: { title: 'Proyectos', icon: '📂', component: ProjectsApp, width: 520, height: 380 },
    blog: { title: 'Blog', icon: '📝', component: BlogApp, width: 440, height: 360 },
    blogpost: { title: 'Post', icon: '📝', component: BlogPostApp, width: 520, height: 440 },
    contact: { title: 'Contacto', icon: '✉️', component: ContactApp, width: 420, height: 480 },
    social: { title: 'Redes Sociales', icon: '🔗', component: SocialApp, width: 460, height: 420 },
    presskit: { title: 'Press Kit', icon: '📋', component: PressKitApp, width: 480, height: 420 },
    resources: { title: 'Recursos', icon: '🎨', component: ResourcesApp, width: 520, height: 400 },
    galaga: { title: 'Film Boss', icon: '🎬', component: GalagaApp, width: 560, height: 440 },
    help: { title: 'Ayuda', icon: '❓', component: HelpApp, width: 420, height: 400 },
    notepad: { title: 'Bloc de Notas', icon: '🗒️', component: NotepadApp, width: 400, height: 320 },
    mediaplayer: { title: 'Reproductor de video', icon: '📺', component: MediaPlayerApp, width: 520, height: 400 },
  };

  function getWindowDims(appId: string): { width: number; height: number } {
    const meta = appRegistry[appId];
    if (!meta) return { width: 400, height: 300 };
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return {
        width: Math.min(meta.width, window.innerWidth - 4),
        height: Math.min(meta.height, window.innerHeight - 44),
      };
    }
    return { width: meta.width, height: meta.height };
  }

  const desktopIcons: DesktopIconDef[] = [
    { id: 'ic-about', label: 'Sobre Mí', icon: '🧑', x: 16, y: 16, appId: 'about', title: 'Sobre Mí' },
    { id: 'ic-projects', label: 'Proyectos', icon: '📂', x: 16, y: 100, appId: 'projects', title: 'Proyectos' },
    { id: 'ic-blog', label: 'Blog', icon: '📝', x: 16, y: 184, appId: 'blog', title: 'Blog' },
    { id: 'ic-contact', label: 'Contacto', icon: '✉️', x: 16, y: 268, appId: 'contact', title: 'Contacto' },
    { id: 'ic-showreel', label: 'Showreel', icon: '📺', x: 16, y: 352, appId: 'mediaplayer', title: 'Reproductor de video' },
    { id: 'ic-patreon', label: 'Patreon', icon: '❤', x: 110, y: 16, appId: 'social', title: 'Patreon', props: { focus: 'patreon' } },
    { id: 'ic-youtube', label: 'YouTube', icon: '▶', x: 110, y: 100, appId: 'social', title: 'YouTube', props: { focus: 'youtube' } },
    { id: 'ic-presskit', label: 'Press Kit', icon: '📋', x: 110, y: 184, appId: 'presskit', title: 'Press Kit' },
    { id: 'ic-resources', label: 'Recursos', icon: '🎨', x: 110, y: 352, appId: 'resources', title: 'Recursos' },
    { id: 'ic-galaga', label: 'Film Boss', icon: '🎬', x: 110, y: 268, appId: 'galaga', title: 'Film Boss', hidden: false },
  ];

  function openWindow(appId: string, titleOverride?: string, props?: Record<string, any>, pos?: { x: number; y: number }) {
    const meta = appRegistry[appId];
    if (!meta) {
      if (appId === 'shutdown') {
        showShutdown = true;
        return;
      }
      return;
    }

    // If a window for this app already exists (and is single-instance), focus it
    const existing = windows.find((w) => w.id.startsWith(appId + '-') && w.props?._single !== false);
    // For blog posts we allow multiple, but for simplicity reuse for now
    if (existing && appId !== 'blogpost') {
      focusWindow(existing.id);
      if (existing.minimized) {
        existing.minimized = false;
      }
      return;
    }

    winCounter++;
    const id = `${appId}-${winCounter}`;
    zCounter++;
    const offsetX = 30 + (winCounter % 6) * 24;
    const offsetY = 20 + (winCounter % 6) * 24;

    const dims = getWindowDims(appId);

    const newWin: WindowState = {
      id,
      title: titleOverride ?? meta.title,
      icon: meta.icon,
      component: meta.component,
      x: pos?.x ?? offsetX,
      y: pos?.y ?? offsetY,
      width: dims.width,
      height: dims.height,
      zIndex: zCounter,
      minimized: false,
      maximized: false,
      props: {
        // La app de Recursos recibe los recursos leídos de src/content/resources/
        ...(appId === 'resources' ? { resources } : {}),
        // El Reproductor recibe el showreel configurado en site-config.md
        ...(appId === 'mediaplayer'
          ? { youtubeId: config.showreelYoutubeId ?? '', videoTitle: config.showreelTitle ?? 'Showreel' }
          : {}),
        ...props,
        onOpenWindow: (childAppId: string, childProps?: Record<string, any>) => openWindow(childAppId, undefined, childProps),
      },
    };

    if (window.innerWidth < 768) {
      newWin.maximized = true;
    }

    windows.push(newWin);
    activeWindowId = id;
  }

  function closeWindow(id: string) {
    const idx = windows.findIndex((w) => w.id === id);
    if (idx >= 0) {
      windows.splice(idx, 1);
      if (activeWindowId === id) {
        activeWindowId = windows.length ? windows[windows.length - 1].id : null;
      }
    }
  }

  function focusWindow(id: string) {
    zCounter++;
    const w = windows.find((w) => w.id === id);
    if (w) {
      w.zIndex = zCounter;
      activeWindowId = id;
    }
  }

  function minimizeWindow(id: string) {
    const w = windows.find((w) => w.id === id);
    if (w) {
      w.minimized = true;
      if (activeWindowId === id) {
        activeWindowId = windows.find((w2) => !w2.minimized && w2.id !== id)?.id ?? null;
      }
    }
  }

  function toggleMaximize(id: string) {
    const w = windows.find((w) => w.id === id);
    if (w) {
      w.maximized = !w.maximized;
    }
  }

  function updateWindowPosition(id: string, x: number, y: number) {
    const w = windows.find((w) => w.id === id);
    if (w && !w.maximized) {
      w.x = x;
      w.y = y;
    }
  }

  function updateWindowSize(id: string, width: number, height: number) {
    const w = windows.find((w) => w.id === id);
    if (w && !w.maximized) {
      w.width = width;
      w.height = height;
    }
  }

  function handleTaskbarClick(id: string) {
    const w = windows.find((w) => w.id === id);
    if (!w) return;
    if (w.minimized) {
      w.minimized = false;
      focusWindow(id);
    } else if (activeWindowId === id) {
      w.minimized = true;
      activeWindowId = null;
    } else {
      focusWindow(id);
    }
  }

  function handleStartClick() {
    startMenuOpen = !startMenuOpen;
  }

  function handleOpenApp(appId: string, props?: Record<string, any>) {
    openWindow(appId, undefined, props);
  }

  function handleIconOpen(icon: DesktopIconDef) {
    openWindow(icon.appId, icon.title, icon.props);
  }

  // Activity tracking for screen saver
  function resetActivity() {
    lastActivity = Date.now();
    if (showScreenSaver) showScreenSaver = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    resetActivity();
    if (showBSoD) return;

    // Konami code
    const key = e.key === 'B' ? 'b' : e.key === 'A' ? 'a' : e.key;
    if (key === KONAMI[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === KONAMI.length) {
        konamiIndex = 0;
        if (!konamiUnlocked) {
          konamiUnlocked = true;
          const gi = desktopIcons.find((i) => i.appId === 'galaga');
          if (gi) gi.hidden = false;
          konamiNotification = '¡Galaga desbloqueado!';
          setTimeout(() => (konamiNotification = ''), 4000);
        }
      }
    } else {
      konamiIndex = key === KONAMI[0] ? 1 : 0;
    }

    if (e.key === 'Escape') {
      startMenuOpen = false;
      dialog = null;
    }
  }

  function handleDesktopClick(e: MouseEvent) {
    resetActivity();
    // Triple-click top-left corner → BSoD
    const target = e.target as HTMLElement;
    const inCorner = e.clientX < 30 && e.clientY < 30;
    if (inCorner) {
      cornerClicks++;
      if (cornerTimer) clearTimeout(cornerTimer);
      cornerTimer = setTimeout(() => {
        cornerClicks = 0;
      }, 800);
      if (cornerClicks >= 3) {
        cornerClicks = 0;
        showBSoD = true;
      }
    } else {
      cornerClicks = 0;
    }

    // Close start menu when clicking desktop
    if (!target.closest('.start-menu') && !target.closest('.taskbar-start')) {
      startMenuOpen = false;
    }
  }

  let screenSaverInterval: ReturnType<typeof setInterval>;
  let checkMobileFn: (() => void) | null = null;

  onMount(() => {
    isMobile = window.innerWidth < 768;
    checkMobileFn = () => { isMobile = window.innerWidth < 768; };
    window.addEventListener('resize', checkMobileFn);

    // El cine primero: si hay showreel configurado, el Reproductor
    // se abre solo al entrar (silenciado), a la derecha de los iconos.
    if (!isMobile && config.showreelYoutubeId) {
      const meta = appRegistry.mediaplayer;
      const x = Math.max(240, Math.round((window.innerWidth - meta.width) / 2));
      const y = Math.max(40, Math.round((window.innerHeight - meta.height) / 2) - 30);
      openWindow('mediaplayer', undefined, { autoplay: true }, { x, y });
    }

    screenSaverInterval = setInterval(() => {
      if (Date.now() - lastActivity > 120000 && !showBSoD) {
        showScreenSaver = true;
      }
    }, 5000);
  });

  onDestroy(() => {
    if (screenSaverInterval) clearInterval(screenSaverInterval);
    if (checkMobileFn) window.removeEventListener('resize', checkMobileFn);
  });
</script>

<svelte:window onkeydown={handleKeydown} onmousemove={resetActivity} onmousedown={handleDesktopClick} />

<div
  class="desktop"
  style={config.wallpaper
    ? `background-image: url('${config.wallpaper}'); background-size: cover; background-position: center;`
    : ''}
>
  <!-- Desktop icons -->
  {#each desktopIcons as icon (icon.id)}
    {#if !icon.hidden}
      <DesktopIcon
        icon={icon.icon}
        label={icon.label}
        x={isMobile ? 16 : icon.x}
        y={isMobile ? 16 + (desktopIcons.filter(d => !d.hidden).indexOf(icon)) * 72 : icon.y}
        onOpen={() => handleIconOpen(icon)}
      />
    {/if}
  {/each}

  <!-- Windows -->
  {#each windows as win (win.id)}
    <Window
      window={win}
      isActive={activeWindowId === win.id}
      onClose={closeWindow}
      onFocus={focusWindow}
      onMinimize={minimizeWindow}
      onMaximize={toggleMaximize}
      onDrag={updateWindowPosition}
      onResize={updateWindowSize}
    >
      {@const Comp = win.component}
      {@const p = win.props ?? {}}
      {@const allProps = { ...p, onOpenWindow: (childAppId: string, childProps?: Record<string, any>) => openWindow(childAppId, undefined, childProps) }}
      <Comp {...allProps} />
    </Window>
  {/each}

  <!-- Start menu -->
  {#if startMenuOpen}
    <StartMenu onOpenApp={handleOpenApp} onClose={() => (startMenuOpen = false)} />
  {/if}

  <!-- Taskbar -->
  <Taskbar
    windows={windows}
    activeWindowId={activeWindowId}
    onTaskbarClick={handleTaskbarClick}
    onStartClick={handleStartClick}
    startMenuOpen={startMenuOpen}
  />

  <!-- Konami notification -->
  {#if konamiNotification}
    <div style="position:fixed; top:60px; right:16px; background:var(--win-yellow); border:2px solid var(--win-black); padding:8px 16px; z-index:10005; font-weight:bold; box-shadow:2px 2px 8px rgba(0,0,0,0.4);">
      🎮 {konamiNotification}
    </div>
  {/if}

  <!-- Dialogs -->
  {#if showBSoD}
    <BSoD onClose={() => (showBSoD = false)} />
  {/if}

  {#if showScreenSaver}
    <ScreenSaver onClose={() => { showScreenSaver = false; resetActivity(); }} />
  {/if}

  {#if dialog}
    <ErrorDialog title={dialog.title} message={dialog.message} icon={dialog.icon} onClose={() => (dialog = null)} />
  {/if}

  {#if showShutdown}
    <div class="dialog-overlay" onclick={() => (showShutdown = false)} role="presentation">
      <div class="dialog-box" onclick={(e) => e.stopPropagation()} onkeydown={(e) => { if (e.key === 'Escape') showShutdown = false; }} role="dialog" aria-label="Apagar el equipo" tabindex="-1">
        <div class="dialog-title-bar">
          <div class="dialog-title-text">Apagar el equipo</div>
          <button class="window-btn window-btn-close" onclick={() => (showShutdown = false)}>✕</button>
        </div>
        <div class="dialog-body">
          <div class="dialog-icon">⏻</div>
          <div class="dialog-message">
            ¿Está seguro que desea apagar el equipo?<br /><br />
            <em>(Easter egg: Esto es solo un sitio web. No puedes apagarlo de verdad.)</em>
          </div>
        </div>
        <div class="dialog-buttons">
          <button class="btn-win" onclick={() => { showShutdown = false; }}>Cancelar</button>
          <button class="btn-win" onclick={() => {
            showShutdown = false;
            dialog = { title: 'BS-OS', message: 'Ahora puede apagar el equipo con seguridad. 😊', icon: '⏻' };
          }}>Sí</button>
        </div>
      </div>
    </div>
  {/if}
</div>