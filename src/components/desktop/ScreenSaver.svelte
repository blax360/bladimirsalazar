<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    onClose: () => void;
  }

  let { onClose }: Props = $props();
  let pos = $state(0);
  let raf: number;

  onMount(() => {
    function animate() {
      pos += 2;
      if (pos > 120) pos = -120;
      raf = requestAnimationFrame(animate);
    }
    animate();
  });

  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf);
  });
</script>

<div
  class="screen-saver"
  onclick={onClose}
  role="button"
  tabindex="0"
  onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
>
  <div class="screen-saver-text" style="transform: translateX({pos}vw);">
    BS-OS
  </div>
</div>