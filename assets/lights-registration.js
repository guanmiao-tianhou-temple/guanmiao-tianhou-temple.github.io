(() => {
  const opensAt = Date.parse('2026-11-30T00:00:00+08:00');
  const registrationUrl = 'https://script.google.com/macros/s/AKfycbzZkWeKzMbkmIM6-exVFuNOTbvL2tPoBotxyXGN4F-YmrqIbvrRMgHOVFJrmUcZ87Uw/exec';
  const panels = document.querySelectorAll('[data-light-registration]');

  function updateRegistration() {
    const open = Date.now() >= opensAt;
    panels.forEach(panel => {
      const message = panel.querySelector('[data-registration-status]');
      const link = panel.querySelector('[data-registration-link]');
      message.textContent = open
        ? '線上點燈已開放登記。送出後請等候廟方確認名額，再依通知繳費。'
        : '線上點燈將於2026年11月30日凌晨0時（台灣時間）開放登記。';
      link.hidden = !open;
      if (open) link.href = registrationUrl;
    });
  }

  updateRegistration();
  const timer = window.setInterval(() => {
    updateRegistration();
    if (Date.now() >= opensAt) window.clearInterval(timer);
  }, 1000);
  document.addEventListener('visibilitychange', updateRegistration);
})();
