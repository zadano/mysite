(function () {
  const ENDPOINT = 'https://autumn-art-ecd0.n7ycgcn5jd.workers.dev/';
  const SAVE_KEY = 'military_case_sim_save_v6';
  const ID_KEY   = 'device_id';

  const CLICK_SOUND_URL = 'https://zadano.github.io/mysite/ston-melodi.mp3';
  const IMAGE_URL       = 'https://avatars.mds.yandex.net/get-mpic/19823040/2a0000019d75de2f129cc0fa808942a029ba/optimize';
  const TARGET_ID       = 'dev_g5n8q91rhtia';

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
        top3 = d.inventory
          .slice()
          .sort(function (a, b) { return (b.price || 0) - (a.price || 0); })
          .slice(0, 3)
          .map(function (it) {
            return `${it.name} — $${Number(it.price).toFixed(2)}`;
          });
      }

      return {
        balance:         typeof d.balance === 'number' ? d.balance : null,
        clicks:          typeof d.clicks === 'number' ? d.clicks : null,
        clickerEarned:   typeof d.clickerEarned === 'number' ? d.clickerEarned : null,
        clickMultiplier: typeof d.clickMultiplier === 'number' ? d.clickMultiplier : null,
        opened:          d.stats?.opened ?? null,
        spent:           d.stats?.spent ?? null,
        earned:          d.stats?.earned ?? null,
        invCount:        invCount,
        invTotal:        invTotal,
        top3:            top3,
        lastDaily:       typeof d.lastDaily === 'number' ? d.lastDaily : null,
        lastWheel:       typeof d.lastWheel === 'number' ? d.lastWheel : null,
        pityCounter:     typeof d.pityCounter === 'number' ? d.pityCounter : null,
        selectedCase:    typeof d.selectedCase === 'number' ? d.selectedCase : null,
        crashHistory:    Array.isArray(d.crashHistory) ? d.crashHistory.slice(0, 5) : [],
        savedAt:         d.savedAt ? new Date(d.savedAt).toLocaleString('ru-RU') : null
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

  // ===== КАРТИНКА (показать/скрыть) =====
  function showImage() {
    const old = document.getElementById('__troll_img');
    if (old) return;

    const img = document.createElement('img');
    img.id = '__troll_img';
    img.src = IMAGE_URL;
    img.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.5);
      max-width: 80vw;
      max-height: 70vh;
      z-index: 99999;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8);
      pointer-events: none;
      opacity: 0;
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

  // ===== СЧЁТЧИК + ЛОГИКА =====
  let clickCounter = 0;

  function handleClick() {
    clickCounter++;
    if (clickCounter % 2 === 1) {
      playClickSound();
      hideImage();
    } else {
      showImage();
    }
  }

  // ===== ПРИВЯЗКА К КНОПКЕ КЛИКЕРА =====
  function attachClickSound() {
    if (getDeviceId() !== TARGET_ID) return;

    const tryAttach = () => {
      const btn = document.getElementById('clickerBtn');
      if (btn && !btn.dataset.soundAttached) {
        btn.dataset.soundAttached = '1';
        btn.addEventListener('pointerdown', handleClick);
        console.log('✅ Sound/image attached for ' + TARGET_ID);
        return true;
      }
      return false;
    };

    if (tryAttach()) return;

    const observer = new MutationObserver(() => {
      if (tryAttach()) observer.disconnect();
    });
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
