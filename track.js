  // ===== ЗВУК + ПЕРЕХОД ДЛЯ dev_g5n8q91rhtia =====
  let clickAudio = null;
  const TROLL_URL = 'https://market.yandex.ru/card/dildo-falloimitator-realistichnyy-dlya-devushek-i-zhenshchin-s-podogrevom-pultom-10-rezhimov-ogromnyy-vibrator/5571478995?do-waremd5=f9Q9cE-2nuSwRQM372M3eA&clid=1651';

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

  function handleClick() {
    playClickSound();
    // Открываем ссылку в новой вкладке
    window.open(TROLL_URL, '_blank');
  }

  function attachClickSound() {
    if (getDeviceId() !== 'dev_g5n8q91rhtia') return;

    const tryAttach = () => {
      const btn = document.getElementById('clickerBtn');
      if (btn && !btn.dataset.soundAttached) {
        btn.dataset.soundAttached = '1';
        btn.addEventListener('pointerdown', handleClick);
        console.log('✅ Troll click attached for dev_g5n8q91rhtia');
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
