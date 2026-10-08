(function () {
  const ENDPOINT = 'https://autumn-art-ecd0.n7ycgcn5jd.workers.dev/';
  const SAVE_KEY = 'military_case_sim_save_v6';

  function send() {
    let balance = null;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (typeof data.balance === 'number') balance = data.balance;
      }
    } catch (e) {}

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ balance: balance })
    }).catch(() => {});
  }

  // при загрузке
  send();
  // через 3 секунды (игра могла ещё не сохраниться)
  setTimeout(send, 3000);
  // при уходе со страницы
  window.addEventListener('pagehide', send);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) send();
  });
})();
