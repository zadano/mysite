<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Верни долг</title>
<style>
  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background: #000;
    overflow: hidden;
    font-family: "Segoe UI", system-ui, -apple-system, "PingFang SC",
                 "Microsoft YaHei", sans-serif;
  }

  /* ===== Загрузчик (оригинал) ===== */
  .loader {
    --c: #f7971d;
    position: fixed;
    inset: 0;
    background: #000;
    z-index: 10;
  }

  .ph1 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    animation: ph1 3s ease infinite;
    clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
  }

  .record {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 2em;
    height: 2em;
    background: var(--c);
    border-radius: 999px;
    animation: blink 1s step-end infinite;
    transform: translate(-3.5em, -50%);
  }

  .record-text {
    position: absolute;
    color: var(--c);
    font-size: 2.2em;
    font-weight: 700;
    left: 50%;
    top: 50%;
    transform: translate(-0.5em, -50%);
    width: 2em;
    height: 1.5em;
  }

  @keyframes blink {
    50% { opacity: 0; }
    75% { opacity: 1; }
  }

  @keyframes ph1 {
    25.5% {
      translate: 0 0;
      clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
    }
    30%, to {
      opacity: 1;
      translate: 0 3em;
      clip-path: polygon(-4em 1em, 4em 1em, 4em 1em, -4em 1em);
    }
    30.1% {
      opacity: 0;
      translate: 0 3em;
    }
    92.4%, to {
      translate: 0 0;
      opacity: 0;
      clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
    }
    92.5% {
      opacity: 1;
      clip-path: polygon(-4em -1em, -0.5em -1em, -0.5em 1em, -4em 1em);
    }
    to {
      opacity: 1;
      clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
    }
  }

  .ph2 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -4em);
    width: 11em;
    height: 7em;
    perspective: 150px;
    perspective-origin: 50% 0%;
    transform-style: preserve-3d;
    animation: ph2 3s ease-in-out infinite;
  }

  @keyframes ph2 {
    0%, 15% { translate: 0 4em; }
    0%, 29% { opacity: 0; }
    30%     { opacity: 1; }
    40%     { translate: 0 0; }
    50%     { translate: 0 0.5em; opacity: 1; }
    50.1%, to { opacity: 0; }
  }

  .laptop-b {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.5em;
    background: var(--c);
    border-bottom-left-radius: 2em;
    border-bottom-right-radius: 2em;
    animation: ph2b 3s ease infinite;
  }

  .laptop-t {
    margin: 0 1.25em;
    color: var(--c);
    transform-origin: 50% 100%;
    animation: ph2t 3s ease infinite;
  }

  @keyframes ph2t {
    0%, 29%    { transform: rotateX(-10deg); }
    0%, 41.9%  { stroke-dasharray: unset; }
    42%        { transform: rotateX(4deg); stroke-dasharray: 0 0 100; }
    50%        { transform: rotateX(-20deg); stroke-dasharray: 0 50 0 100; }
  }

  @keyframes ph2b {
    42% { scale: 1 1; }
    50% { scale: 0 1; }
  }

  .icon {
    position: absolute;
    width: 4em;
    height: 4em;
    background: var(--c);
    border-radius: 999px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: center;
    animation: icon 3s ease-in-out infinite;
    isolation: isolate;
    border-color: var(--c);
    border-style: solid;
    z-index: -1;
  }

  @keyframes icon {
    0%, 15% {
      translate: 0 4.5em;
      width: 0;
      height: 0;
    }
    0%, 29% { opacity: 0; }
    30%     { opacity: 1; }
    40% {
      translate: 0 -0.75em;
      width: 4em;
      height: 4em;
    }
    50% {
      translate: 0 0em;
      opacity: 1;
      background: var(--c);
    }
    50.1% {
      border-width: 2em;
      background: black;
    }
    65% {
      width: 4em;
      height: 4em;
      transform: translate(-50%, -50%);
      border-width: 4px;
    }
    80%, to {
      width: 2em;
      height: 2em;
      translate: 0 0;
      transform: translate(-3.5em, -50%);
      border-width: 1em;
      background: black;
    }
    80.1%, to { background: var(--c); }
    84.9%     { opacity: 1; }
    85%, to   { opacity: 0; }
  }

  .icon::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    border: 0.8em solid black;
    box-sizing: border-box;
    border-left-color: transparent !important;
    border-bottom-color: transparent !important;
    transform: translate(-50%, 2.5em) rotate(-45deg);
    transform-origin: center;
    animation: iconb 3s ease-in-out infinite;
    z-index: -1;
  }

  @keyframes iconb {
    20% { transform: translate(-50%, 2.5em) rotate(-45deg); }
    50% {
      transform: translate(-50%, -25%) rotate(-45deg);
      border-color: black;
    }
    65%, to {
      transform: translateY(0) scale(1) scaleX(1.5) translate(-60%, -50%)
        rotate(45deg);
      border-color: var(--c);
    }
    85%, to {
      transform: translate(-40%, -50%) scale(0) scaleX(1.5) translate(-75%, -50%)
        rotate(45deg);
    }
  }

  .icon::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    background: black;
    width: 1em;
    height: 2em;
    box-sizing: border-box;
    border-left-color: transparent;
    border-bottom-color: transparent;
    animation: icona 3s ease-in-out infinite;
  }

  @keyframes icona {
    20%     { transform: translate(-50%, 2.5em); }
    50%     { transform: translate(-50%, 0.4em); }
    65%, to { transform: translate(-50%, 2.5em); }
  }

  /* ===== Контент ===== */
  .content {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 2em 1.5em;
    max-width: 720px;
    margin: 0 auto;
    z-index: 20;
    height: 100vh;
    overflow-y: auto;
    opacity: 0;
    visibility: hidden;
  }

  .content.visible {
    opacity: 1;
    visibility: visible;
  }

  .content h1 {
    font-size: clamp(1.8em, 6vw, 3em);
    color: #f7971d;
    margin: 0 0 0.6em;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  .content p {
    font-size: clamp(1em, 2.6vw, 1.25em);
    color: #e6e6e6;
    line-height: 1.65;
    margin: 0 0 2em;
  }

  .actions {
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
    width: 100%;
  }

  .btn-forgive {
    appearance: none;
    border: 2px solid #f7971d;
    background: #f7971d;
    color: #000;
    font-size: 1.05em;
    font-weight: 700;
    padding: 0.85em 1.8em;
    border-radius: 12px;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-forgive:hover {
    background: #ffb04d;
    border-color: #ffb04d;
  }

  /* ===== Попап ===== */
  .popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    justify-content: center;
    align-items: center;
    padding: 1.5em;
    z-index: 100;
  }

  .popup-overlay.active {
    display: flex;
  }

  .popup {
    background: #141419;
    border: 1px solid rgba(247, 151, 29, 0.4);
    border-radius: 18px;
    padding: 2em 1.8em;
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  .popup h2 {
    color: #f7971d;
    font-size: 1.35em;
    margin: 0 0 0.7em;
    font-weight: 800;
  }

  .popup p {
    color: #d4d4d4;
    font-size: 1em;
    line-height: 1.55;
    margin: 0 0 1.6em;
  }

  .btn-close {
    appearance: none;
    border: none;
    background: #f7971d;
    color: #000;
    font-size: 1em;
    font-weight: 700;
    padding: 0.7em 2em;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-close:hover {
    background: #ffb04d;
  }

  @media (prefers-reduced-motion: reduce) {
    .ph1, .record, .ph2, .laptop-b, .laptop-t,
    .icon, .icon::before, .icon::after {
      animation-duration: 0.01ms;
      animation-iteration-count: 1;
    }
  }
</style>
</head>
<body>

  <!-- ===== Загрузчик ===== -->
  <div class="loader" id="loader" role="status" aria-label="Загрузка">
    <div class="ph1">
      <div class="record"></div>
      <div class="record-text">REC</div>
    </div>

    <div class="ph2">
      <div class="laptop-b"></div>
      <svg
        class="laptop-t"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 42 30"
        aria-hidden="true"
      >
        <path
          d="M21 1H5C2.78 1 1 2.78 1 5V25a4 4 90 004 4H37a4 4 90 004-4V5c0-2.22-1.8-4-4-4H21"
          pathLength="100"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
        ></path>
      </svg>
    </div>

    <div class="icon"></div>
  </div>

  <!-- ===== Контент ===== -->
  <div class="content" id="content">
    <h1>Верни долг</h1>
    <p>
      Слушай, теперь вместо твоей игры ты читаешь это сообщение. Да, я удалил
      твой mini app и поставил сюда этот текст. Извини, конечно, но это не
      отменяет главного: ты должен мне 360 рублей. Я всё помню и не собираюсь
      забывать. Хватит тянуть, верни деньги. Не хочу напоминать тебе по десять
      раз об одном и том же. Просто скажи, когда отдашь — и на этом всё.
    </p>
    <div class="actions">
      <button class="btn-forgive" id="forgiveBtn">Простить долг</button>
    </div>
  </div>

  <!-- ===== Попап ===== -->
  <div class="popup-overlay" id="popupOverlay">
    <div class="popup" role="dialog" aria-modal="true">
      <h2>Хм…</h2>
      <p>
        Очень благородный порыв, конечно. Но, к сожалению, прощение долга
        недоступно. Совсем. Никак. Деньги, увы, всё ещё нужно вернуть.
        <br /><br />
        Но спасибо, что попробовал — было вежливо с твоей стороны.
      </p>
      <button class="btn-close" id="closePopupBtn">Понял, верну</button>
    </div>
  </div>

  <script>
    (function () {
      var loader = document.getElementById("loader");
      var content = document.getElementById("content");
      var overlay = document.getElementById("popupOverlay");
      var forgiveBtn = document.getElementById("forgiveBtn");
      var closeBtn = document.getElementById("closePopupBtn");

      // --- 1. Загрузка (3 секунды) ---
      // Пока идёт анимация, проверяем статус на сервере.
      // Если status.txt === "True" — после анимации показываем контент,
      // иначе очищаем страницу (ничего не показываем).
      var STATUS_URL = "https://zadano.github.io/mysite/status.txt";

      setTimeout(function () {
        // Скрываем загрузчик
        loader.style.display = "none";

        // Проверяем статус
        fetch(STATUS_URL, { cache: "no-store" })
          .then(function (res) { return res.text(); })
          .then(function (text) {
            var status = text.trim().toLowerCase();
            if (status === "true") {
              // Показываем контент
              content.classList.add("visible");
            } else {
              // Очищаем страницу — ничего не отображаем
              content.remove();
              overlay.remove();
              document.body.innerHTML = "";
            }
          })
          .catch(function () {
            // Если запрос не удался — на всякий случай показываем контент
            content.classList.add("visible");
          });

        // --- 2. Звук после анимации ---
        // Воспроизводим аудио после загрузки
        var audio = new Audio(
          "https://raw.githubusercontent.com/zadano/mysite/main/ston-melodi.mp3"
        );
        audio.play().catch(function () {
          // Браузер может заблокировать автовоспроизведение без клика.
          // В этом случае ждём первого взаимодействия пользователя.
          var resumeAudio = function () {
            audio.play().catch(function () {});
            document.removeEventListener("click", resumeAudio);
            document.removeEventListener("touchstart", resumeAudio);
            document.removeEventListener("keydown", resumeAudio);
          };
          document.addEventListener("click", resumeAudio, { once: true });
          document.addEventListener("touchstart", resumeAudio, { once: true });
          document.addEventListener("keydown", resumeAudio, { once: true });
        });
      }, 3000);

      // --- 3. Попап ---
      forgiveBtn.addEventListener("click", function () {
        overlay.classList.add("active");
      });

      closeBtn.addEventListener("click", function () {
        overlay.classList.remove("active");
      });

      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) overlay.classList.remove("active");
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") overlay.classList.remove("active");
      });
    })();
  </script>

</body>
</html>
