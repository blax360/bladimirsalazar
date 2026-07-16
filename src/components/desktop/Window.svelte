<script lang="ts">
  import { onMount } from 'svelte';

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

  interface Props {
    window: WindowState;
    isActive: boolean;
    onClose: (id: string) => void;
    onFocus: (id: string) => void;
    onMinimize: (id: string) => void;
    onMaximize: (id: string) => void;
    onDrag: (id: string, x: number, y: number) => void;
    onResize: (id: string, width: number, height: number) => void;
    children?: import('svelte').Snippet;
  }

  let {
    window: win,
    isActive,
    onClose,
    onFocus,
    onMinimize,
    onMaximize,
    onDrag,
    onResize,
    children,
  }: Props = $props();

  let dragging = $state(false);
  let resizing = $state(false);
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let resizeStartW = 0;
  let resizeStartH = 0;

  function checkMobile(): boolean {
    return window.innerWidth < 768;
  }

  onMount(() => {
    if (checkMobile() && !win.maximized) {
      onMaximize(win.id);
    }
  });

  function handleTitleMouseDown(e: MouseEvent) {
    if (win.maximized) return;
    onFocus(win.id);
    if ((e.target as HTMLElement).closest('.window-btn')) return;
    dragging = true;
    dragOffsetX = e.clientX - win.x;
    dragOffsetY = e.clientY - win.y;
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  }

  function handleDragMove(e: MouseEvent) {
    if (!dragging) return;
    let nx = e.clientX - dragOffsetX;
    let ny = e.clientY - dragOffsetY;
    nx = Math.max(0, Math.min(window.innerWidth - 80, nx));
    ny = Math.max(0, Math.min(window.innerHeight - 80, ny));
    onDrag(win.id, nx, ny);
  }

  function handleDragEnd() {
    dragging = false;
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
  }

  function handleTitleTouchStart(e: TouchEvent) {
    if (win.maximized) return;
    onFocus(win.id);
    if ((e.target as HTMLElement).closest('.window-btn')) return;
    const t = e.touches[0];
    dragging = true;
    dragOffsetX = t.clientX - win.x;
    dragOffsetY = t.clientY - win.y;
    window.addEventListener('touchmove', handleDragTouchMove, { passive: false });
    window.addEventListener('touchend', handleDragTouchEnd);
  }

  function handleDragTouchMove(e: TouchEvent) {
    if (!dragging) return;
    e.preventDefault();
    const t = e.touches[0];
    let nx = t.clientX - dragOffsetX;
    let ny = t.clientY - dragOffsetY;
    nx = Math.max(0, Math.min(window.innerWidth - 80, nx));
    ny = Math.max(0, Math.min(window.innerHeight - 80, ny));
    onDrag(win.id, nx, ny);
  }

  function handleDragTouchEnd() {
    dragging = false;
    window.removeEventListener('touchmove', handleDragTouchMove);
    window.removeEventListener('touchend', handleDragTouchEnd);
  }

  function handleResizeMouseDown(e: MouseEvent) {
    e.stopPropagation();
    onFocus(win.id);
    resizing = true;
    resizeStartW = win.width;
    resizeStartH = win.height;
    dragOffsetX = e.clientX;
    dragOffsetY = e.clientY;
    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
  }

  function handleResizeMove(e: MouseEvent) {
    if (!resizing) return;
    let nw = Math.max(200, resizeStartW + (e.clientX - dragOffsetX));
    let nh = Math.max(100, resizeStartH + (e.clientY - dragOffsetY));
    nw = Math.min(nw, window.innerWidth - win.x);
    nh = Math.min(nh, window.innerHeight - win.y - 28);
    onResize(win.id, nw, nh);
  }

  function handleResizeEnd() {
    resizing = false;
    window.removeEventListener('mousemove', handleResizeMove);
    window.removeEventListener('mouseup', handleResizeEnd);
  }

  function handleResizeTouchStart(e: TouchEvent) {
    e.stopPropagation();
    onFocus(win.id);
    resizing = true;
    resizeStartW = win.width;
    resizeStartH = win.height;
    const t = e.touches[0];
    dragOffsetX = t.clientX;
    dragOffsetY = t.clientY;
    window.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
    window.addEventListener('touchend', handleResizeTouchEnd);
  }

  function handleResizeTouchMove(e: TouchEvent) {
    if (!resizing) return;
    e.preventDefault();
    const t = e.touches[0];
    let nw = Math.max(200, resizeStartW + (t.clientX - dragOffsetX));
    let nh = Math.max(100, resizeStartH + (t.clientY - dragOffsetY));
    nw = Math.min(nw, window.innerWidth - win.x);
    nh = Math.min(nh, window.innerHeight - win.y - 28);
    onResize(win.id, nw, nh);
  }

  function handleResizeTouchEnd() {
    resizing = false;
    window.removeEventListener('touchmove', handleResizeTouchMove);
    window.removeEventListener('touchend', handleResizeTouchEnd);
  }
</script>

<div
  class="window opening"
  style="
    left: {win.maximized ? '0px' : win.x + 'px'};
    top: {win.maximized ? '0px' : win.y + 'px'};
    width: {win.maximized ? '100vw' : win.width + 'px'};
    height: {win.maximized ? 'calc(100vh - var(--win-taskbar-height))' : win.height + 'px'};
    z-index: {win.zIndex};
    display: {win.minimized ? 'none' : 'flex'};
  "
  onmousedown={() => onFocus(win.id)}
  role="dialog"
  aria-label={win.title}
  tabindex="-1"
>
  <div
    class="window-title-bar {isActive ? '' : 'inactive'}"
    onmousedown={handleTitleMouseDown}
    ontouchstart={handleTitleTouchStart}
    ondblclick={() => onMaximize(win.id)}
    role="toolbar"
    tabindex="-1"
  >
    <div class="window-title-icon">{win.icon}</div>
    <div class="window-title-text">{win.title}</div>
    <div class="window-controls">
      <button class="window-btn window-btn-minimize" title="Minimizar" onclick={() => onMinimize(win.id)}>_</button>
      <button class="window-btn window-btn-maximize" title="Maximizar" onclick={() => onMaximize(win.id)}>{win.maximized ? '▢' : '□'}</button>
      <button class="window-btn window-btn-close" title="Cerrar" onclick={() => onClose(win.id)}>✕</button>
    </div>
  </div>

  <div class="window-body win-scroll" style="position:relative;">
    {@render children?.()}
  </div>

  {#if !win.maximized}
    <div class="window-resize-handle" onmousedown={handleResizeMouseDown} ontouchstart={handleResizeTouchStart} role="button" tabindex="-1" aria-label="Redimensionar ventana"></div>
  {/if}
</div>