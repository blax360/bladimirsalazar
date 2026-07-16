<script lang="ts">
  interface Props {
    onClose: () => void;
  }

  let { onClose }: Props = $props();
</script>

<div class="bsod">
A fatal exception has occurred at BS:0072:BFFAD.

The current application will be terminated.

* Press any key to continue.

* Press CTRL+ALT+DEL to restart your computer. You will
  lose any unsaved information in all applications.

  BS-OS · Version 1.00 · (C) 2026 Bladimir Salazar

  P.S. This was an easter egg. Everything is fine. 😊

  <button class="bsod-close" onclick={onClose}>Cerrar [✕]</button>
</div>