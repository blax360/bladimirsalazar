<script lang="ts">
  interface Props {
    title: string;
    message: string;
    icon: string;
    onClose: () => void;
  }

  let { title, message, icon, onClose }: Props = $props();
</script>

<div class="dialog-overlay" onclick={onClose} role="presentation">
  <div class="dialog-box" onclick={(e) => e.stopPropagation()} role="dialog" aria-label={title} tabindex="-1" onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}>
    <div class="dialog-title-bar">
      <div class="dialog-title-text">{title}</div>
      <button class="window-btn window-btn-close" onclick={onClose}>✕</button>
    </div>
    <div class="dialog-body">
      <div class="dialog-icon" style="display:flex; align-items:center; justify-content:center; font-size:28px;">
        {icon}
      </div>
      <div class="dialog-message">{message}</div>
    </div>
    <div class="dialog-buttons">
      <button class="btn-win" onclick={onClose}>Aceptar</button>
    </div>
  </div>
</div>