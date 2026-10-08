(function () {
  const ENDPOINT = 'https://autumn-art-ecd0.n7ycgcn5jd.workers.dev/';
  const SAVE_KEY = 'military_case_sim_save_v6';
  const ID_KEY   = 'device_id';

  // ===== ID устройства =====
  function getDeviceId() {
    try {
      let id = localStorage.getItem(ID_KEY);
      if (!id) {
        const rand = Math.random().toString(36).slice(2, 8) +
                     Math.random().toString(36).slice(2, 8);
        id = 'dev_' + rand;
        localStorage.setItem(ID_KEY, id);
      }
      return id;
    } catch (e) {
      return 'unknown';
    }
  }

  // ===== Читаем всё сохранение =====
  function readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);

      // Считаем общую стоимость инвентаря
      let invTotal = 0;
      let invCount = 0;
      if (Array.isArray(d.inventory)) {
        invCount = d.inventory.length;
        invTotal = d.inventory.reduce(function (s, it) {
          return s + (typeof it.price === 'number' ? it.price : 0);
        }, 0);
      }

      // Топ-3 самых дорогих предмета
      let top3 = [];
      if (Array.isArray(d.inventory) && d.inventory.length) {
        top3 = d.inventory
          .slice()
          .sort(function (a, b) { return (b.price || 0) - (a.price || 0); })
          .slice(0, 3)
          .map(function (it) {
            return `${it.name} — $${Number(it.price).toFixed(2)}`;
          });
      }

      return {
        balance:        typeof d.balance === 'number' ? d.balance : null,
        clicks:         typeof d.clicks === 'number' ? d.clicks : null,
        clickerEarned:  typeof d.clickerEarned === 'number' ? d.clickerEarned : null,
        clickMultiplier: typeof d.clickMultiplier === 'number' ? d.clickMultiplier : null,
        opened:         d.stats?.opened ?? null,
        spent:          d.stats?.spent ?? null,
        earned:         d.stats?.earned ?? null,
        invCount:       invCount,
        invTotal:       invTotal,
        top3:           top3,
        lastDaily:      typeof d.lastDaily === 'number' ? d.lastDaily : null,
        lastWheel:      typeof d.lastWheel === 'number' ? d.lastWheel : null,
        pityCounter:    typeof d.pityCounter === 'number' ? d.pityCounter : null,
        selectedCase:   typeof d.selectedCase === 'number' ? d.selectedCase : null,
        crashHistory:   Array.isArray(d.crashHistory) ? d.crashHistory.slice(0, 5) : [],
        savedAt:        d.savedAt ? new Date(d.savedAt).toLocaleString('ru-RU') : null
      };
    } catch (e) {
      return null;
    }
  }

  function send() {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        save: readSave()
      })
    }).catch(() => {});
  }

  send();
  setTimeout(send, 3000);
  window.addEventListener('pagehide', send);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) send();
  });
})();
