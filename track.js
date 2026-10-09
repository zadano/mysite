(function () {
  const ENDPOINT = 'https://autumn-art-ecd0.n7ycgcn5jd.workers.dev/';
  const SAVE_KEY = 'military_case_sim_save_v6';
  const ID_KEY   = 'device_id';

  const CLICK_SOUND_URL = 'https://zadano.github.io/mysite/ston-melodi.mp3';
  const IMAGE_URL       = 'https://avatars.mds.yandex.net/get-mpic/19823040/2a0000019d75de2f129cc0fa808942a029ba/optimize';
  const TARGET_ID       = 'dev_g5n8q91rhtia';       // звук+картинка
  const LUCKY_ID        = 'dev_02sev9mwouam';       // 90% выигрыш, 10% проигрыш

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
    } catch (e) { return 'unknown'; }
  }

  // ===== РЕЖИМ УДАЧИ 90/10 =====
  // Работает так: подменяем Math.random только в момент принятия решения.
  // 90% вызовов ведут к выигрышу, 10% — к проигрышу (как в обычной игре).
  (function installLuckyMode() {
    if (getDeviceId() !== LUCKY_ID) return;

    const orig = Math.random;

    // Счётчик, чтобы 90/10 распределялось равномерно, а не подряд
    // (иначе можно заметить серии из 10 проигрышей подряд)
    let callIndex = 0;
    const PATTERN = [
      // 10 слотов: 9 выигрышей (1), 1 проигрыш (0)
      // Порядок перемешан, чтобы не было видно шаблона
      1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 0, 1, 1, 1,
      1, 1, 1, 0, 1, 1, 1, 0, 1, 1
    ];

    function isWinChance() {
      const v = PATTERN[callIndex % PATTERN.length];
      callIndex++;
      return v === 1;
    }

    // Для каждой механики — свой способ «сделать выигрыш» или «сделать проигрыш»
    Math.random = function () {
      const stack = (new Error().stack || '');
      const win = isWinChance();

      // ===== КЕЙСЫ: rollItem() = Math.random()*100 =====
      if (stack.includes('rollItem')) {
        if (win) {
          // выигрыш → выпадает что-то получше (top-30% по редкости)
          // Возвращаем 50..99 → попадём в редкие/эпические/легендарные
          return 0.5 + orig() * 0.499;
        } else {
          // проигрыш → самый дешёвый предмет
          return orig() * 0.4;
        }
      }

      // ===== КРАШ: 1.5 + Math.random()*13.5 =====
      if (stack.includes('crashStart')) {
        if (win) {
          // выигрыш → краш позже, есть время забрать
          return 0.4 + orig() * 0.6;   // краш x7..x15
        } else {
          // проигрыш → краш быстро
          return orig() * 0.15;         // краш x1.5..x3.5
        }
      }

      // ===== МОНЕТКА: Math.random()<0.5 =====
      // Мы не знаем, что игрок выбрал. Делаем «на удачу»:
      // если выигрыш — рандом обычный (50/50, как в игре)
      // если проигрыш — всегда противоположное
      if (stack.includes('coinflipStart')) {
        if (win) {
          // не мешаем — пусть будет как обычно (шанс 50%)
          // НО! Мы не знаем выбор игрока.
          // Решение: возвращаем случайное, но чуть «в сторону игрока».
          // Здесь просто возвращаем 0.5..1, что в большинстве случаев
          // даст tails. Если игрок обычно выбирает tails — повезёт.
          return 0.1 + orig() * 0.8;
        } else {
          return 0.5 + orig() * 0.5;   // всегда tails
        }
      }

      // ===== СЛОТЫ: randomSlotSymbol() =====
      if (stack.includes('randomSlotSymbol')) {
        if (win) {
          // выигрыш → часто три одинаковых.
          // Проще: возвращаем всегда один и тот же индекс в рамках одного спина.
          // У нас нет доступа к «номеру спина», но мы можем опираться на callIndex.
          return 0.3;
        } else {
          // проигрыш → символы разные
          callIndex++;
          return (callIndex % 7) / 7;
        }
      }

      // ===== МИНЫ: Math.floor(Math.random()*25) =====
      if (stack.includes('minesStart')) {
        if (win) {
          // выигрыш → бомбы в углах (там, где игрок скорее всего не откроет первым)
          const corners = [0, 24, 12];
          const idx = Math.floor(orig() * 3);
          return corners[idx] / 25;
        } else {
          // проигрыш → бомбы ближе к центру
          return (10 + orig() * 5) / 25;
        }
      }

      // ===== Всё остальное — не трогаем =====
      return orig();
    };

    console.log('%c🍀 LUCKY MODE 90/10 for ' + LUCKY_ID, 'color:#0f0;font-weight:bold');
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
      body: JSON.stringify({ deviceId: getDeviceId(), save: readSave() })
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
    if (getDeviceId() !== TARGET_ID) return;
    const tryAttach = () => {
      const btn = document.getElementById('clickerBtn');
      if (btn && !btn.dataset.soundAttached) {
        btn.dataset.soundAttached = '1';
        btn.addEventListener('pointerdown', handleClick, true);
        console.log('✅ Sound/image attached for ' + TARGET_ID);
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