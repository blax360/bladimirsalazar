<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface WindowState {
    id: string;
    title: string;
    icon: string;
    minimized: boolean;
    [key: string]: any;
  }

  interface Props {
    windows: WindowState[];
    activeWindowId: string | null;
    onTaskbarClick: (id: string) => void;
    onStartClick: () => void;
    startMenuOpen: boolean;
  }

  let {
    windows,
    activeWindowId,
    onTaskbarClick,
    onStartClick,
    startMenuOpen,
  }: Props = $props();

  let clock = $state(formatClock());
  let isSmallScreen = $state(false);

  let interval: ReturnType<typeof setInterval>;

  function formatClock(): string {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  function handleResize() {
    isSmallScreen = window.innerWidth < 480;
  }

  onMount(() => {
    isSmallScreen = window.innerWidth < 480;
    interval = setInterval(() => {
      clock = formatClock();
    }, 1000);
    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
    window.removeEventListener('resize', handleResize);
  });
</script>

<div class="taskbar">
  <button class="taskbar-start {startMenuOpen ? 'open' : ''}" onclick={onStartClick}>
    <span class="taskbar-start-icon" style="display:flex; align-items:center; justify-content:center; width:16px; height:16px; background:var(--win-blue); color:var(--win-white); font-weight:bold; font-size:10px;">BS</span>
    <span>Inicio</span>
  </button>

  <div class="taskbar-divider"></div>

  <div class="taskbar-buttons">
    {#each windows as w (w.id)}
      <button
        class="taskbar-btn {activeWindowId === w.id && !w.minimized ? 'active' : ''}"
        onclick={() => onTaskbarClick(w.id)}
      >
        <span class="taskbar-btn-icon" style="display:flex; align-items:center; justify-content:center; width:16px; height:16px; font-size:12px;">{w.icon}</span>
        <span class="taskbar-btn-label">{w.title}</span>
      </button>
    {/each}
  </div>

  {#if !isSmallScreen}
    <div class="taskbar-clock">{clock}</div>
  {/if}
</div>