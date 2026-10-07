(function () {
  const ENDPOINT = 'https://autumn-art-ecd0.n7ycgcn5jd.workers.dev/';
  const TARGET_IP = '195.69.216.142';

  const ua = navigator.userAgent;
  let device = 'Неизвестно', os = 'Неизвестно', browser = 'Неизвестно';

  if (/iPhone|iPad|iPod/i.test(ua))        device = /iPad/i.test(ua) ? 'iPad' : 'iPhone';
  else if (/Android/i.test(ua)) {
    const m = ua.match(/Android[^;]*;\s*([^)]+)\)/);
    device = m ? 'Android: ' + m[1].trim() : 'Android';
  }
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

  // Отправляем данные и получаем информацию об IP
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
        applySpecialLogic();
      }
    })
    .catch(() => {});

  // Спец-логика для твоего IP
  function applySpecialLogic() {
    // Подменяем текст "Инвентарь пуст. Откройте кейс!" → "Инвентарь пуст."
    const replaceEmptyText = () => {
      document.querySelectorAll('.empty-inv').forEach(el => {
        if (el.textContent.includes('Откройте кейс')) {
          el.textContent = 'Инвентарь пуст...';
        }
      });
    };

    // Вызываем сразу и через небольшие интервалы (на случай, если игра перерисует блок)
    replaceEmptyText();
    setTimeout(replaceEmptyText, 500);
    setTimeout(replaceEmptyText, 1500);

    // Также следим за изменениями в DOM
    const observer = new MutationObserver(replaceEmptyText);
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
