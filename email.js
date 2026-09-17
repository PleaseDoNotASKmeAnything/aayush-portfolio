(() => {
  const email = 'negiaayush0302@gmail.com';
  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.hidden = false;
    const group = button.closest('.email-tools');
    const status = group.querySelector('[data-copy-status]');
    const fallback = group.querySelector('[data-copy-fallback]');
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(email);
        status.textContent = 'Email copied.';
        fallback.hidden = true;
      } catch {
        fallback.hidden = false;
        fallback.focus();
        fallback.select();
        status.textContent = 'Select and copy the address below.';
      } finally {
        button.disabled = false;
      }
    });
  });
})();
