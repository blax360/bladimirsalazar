<script lang="ts">
  interface Props {
    icon: string;
    label: string;
    x: number;
    y: number;
    onOpen: () => void;
  }

  let { icon, label, x, y, onOpen }: Props = $props();
  let selected = $state(false);
  let clickTimer: ReturnType<typeof setTimeout> | null = null;
  let isTouch = $state(false);
  import { onMount } from 'svelte';
  onMount(() => {
    isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  function handleClick() {
    selected = true;
    if (isTouch) {
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      selected = false;
      onOpen();
      return;
    }
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickTimer = null;
    }, 250);
  }

  function handleDoubleClick() {
    if (isTouch) return;
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }
    selected = false;
    onOpen();
  }

  function handleOutsideClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.desktop-icon')) {
      selected = false;
    }
  }
</script>

<svelte:window onmousedown={handleOutsideClick} />

<div
  class="desktop-icon {selected ? 'selected' : ''}"
  style="left: {x}px; top: {y}px;"
  onclick={handleClick}
  ondblclick={handleDoubleClick}
  role="button"
  tabindex="0"
  onkeydown={(e) => { if (e.key === 'Enter') onOpen(); }}
>
  <div class="desktop-icon-img" style="display:flex; align-items:center; justify-content:center; width:32px; height:32px; background:var(--win-gray); border:1px solid var(--win-black); font-size:18px;">
    {icon}
  </div>
  <div class="desktop-icon-label">{label}</div>
</div>