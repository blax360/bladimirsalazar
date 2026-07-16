<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Desktop from './desktop/Desktop.svelte';
  import NokiaDesktop from './mobile/NokiaDesktop.svelte';

  interface Props {
    resources?: any[];
    config?: Record<string, any>;
  }

  let { resources = [], config = {} }: Props = $props();

  let isMobile = $state(false);
  let mounted = $state(false);

  function checkMobile() {
    isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);
  }

  let resizeFn: (() => void) | null = null;

  onMount(() => {
    checkMobile();
    mounted = true;
    resizeFn = () => checkMobile();
    window.addEventListener('resize', resizeFn);
  });

  onDestroy(() => {
    if (resizeFn) window.removeEventListener('resize', resizeFn);
  });
</script>

{#if !mounted}
  <div style="width:100vw;height:100vh;background:#008080;"></div>
{:else if isMobile}
  <NokiaDesktop {resources} />
{:else}
  <Desktop {resources} {config} />
{/if}