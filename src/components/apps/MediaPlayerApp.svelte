<script lang="ts">
  interface Props {
    youtubeId?: string;
    videoTitle?: string;
    autoplay?: boolean;
  }

  let { youtubeId = '', videoTitle = 'Showreel', autoplay = false }: Props = $props();

  const embedUrl = $derived(
    youtubeId
      ? `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0${autoplay ? '&autoplay=1&mute=1' : ''}`
      : ''
  );
</script>

<div class="mediaplayer">
  <div class="mediaplayer-screen">
    {#if youtubeId}
      <iframe
        src={embedUrl}
        title={videoTitle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    {:else}
      <div class="mediaplayer-empty">
        <div class="mediaplayer-empty-icon">🎬</div>
        <div>SIN SEÑAL</div>
        <div class="mediaplayer-empty-sub">Showreel próximamente</div>
      </div>
    {/if}
  </div>
  <div class="mediaplayer-status">
    <span class="mediaplayer-led"></span>
    <span class="mediaplayer-track">▶ {videoTitle}</span>
  </div>
</div>

<style>
  .mediaplayer {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--win-face);
    padding: 6px;
    gap: 6px;
  }

  .mediaplayer-screen {
    flex: 1;
    min-height: 0;
    background: var(--win-black);
    border-top: 2px solid var(--win-shadow);
    border-left: 2px solid var(--win-shadow);
    border-bottom: 2px solid var(--win-light);
    border-right: 2px solid var(--win-light);
    position: relative;
  }

  .mediaplayer-screen iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }

  .mediaplayer-empty {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--win-gray);
    font-weight: bold;
    letter-spacing: 2px;
  }

  .mediaplayer-empty-icon {
    font-size: 32px;
  }

  .mediaplayer-empty-sub {
    font-weight: normal;
    letter-spacing: 0;
    color: var(--win-gray-dark);
  }

  .mediaplayer-status {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 6px;
    background: var(--win-face);
    border-top: 1px solid var(--win-shadow);
    border-left: 1px solid var(--win-shadow);
    border-bottom: 1px solid var(--win-light);
    border-right: 1px solid var(--win-light);
    white-space: nowrap;
    overflow: hidden;
  }

  .mediaplayer-led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00c000;
    border: 1px solid var(--win-black);
    flex-shrink: 0;
  }

  .mediaplayer-track {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
