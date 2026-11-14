/**
 * Скрипт для встраивания на страницу.
 * Если status.txt === "True" — удаляет всё содержимое страницы
 * и отображает "Верни долг" (лоадер → контент → попап).
 * Иначе — ничего не делает, страница остаётся как есть.
 *
 * Вставь как <script src="..."></script> или инлайном.
 */
(function () {
  "use strict";

  var STATUS_URL = "https://zadano.github.io/mysite/status.txt";
  var AUDIO_URL  = "https://raw.githubusercontent.com/zadano/mysite/main/ston-melodi.mp3";

  /* ---------- 1. Проверяем статус ---------- */
  fetch(STATUS_URL, { cache: "no-store" })
    .then(function (res) { return res.text(); })
    .then(function (text) {
      if (text.trim().toLowerCase() !== "true") return; // не True — выходим, страница не тронется
      start(); // True — запускаем сценарий
    })
    .catch(function () {
      /* нет сети / ошибка — ничего не делаем */
    });

  /* ---------- 2. Основной сценарий ---------- */
  function start() {
    /* --- 2.1. Вставляем стили --- */
    var style = document.createElement("style");
    style.textContent = `
      /* ===== Загрузчик ===== */
      .vz-loader {
        --c: #f7971d;
        position: fixed;
        inset: 0;
        background: #000;
        z-index: 999999;
        font-family: "Segoe UI", system-ui, -apple-system, "PingFang SC",
                     "Microsoft YaHei", sans-serif;
      }
      .vz-ph1 {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        animation: vz-ph1 3s ease infinite;
        clip-path: polygon(-4em -1em, 4em -1em, 4em 1em, -4em 1em);
      }
      .vz-record {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2em;
        height: 2em;
        background: var(--c);
        border-radius: 999px;
        animation: vz-blink 1s step-end infinite;
        transform: translate(-3.5em, -50%);
      }
      .vz-record-text {
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
      @keyframes vz-blink {
        50% { opacity: 0; }
        75% { opacity: 1; }
      }
      @keyframes vz-ph1 {
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
      .vz-ph2 {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -4em);
        width: 11em;
        height: 7em;
        perspective: 150px;
        perspective-origin: 50% 0%;
        transform-style: preserve-3d;
        animation: vz-ph2 3s ease-in-out infinite;
      }
      @keyframes vz-ph2 {
        0%, 15% { translate: 0 4em; }
        0%, 29% { opacity: 0; }
        30%     { opacity: 1; }
        40%     { translate: 0 0; }
        50%     { translate: 0 0.5em; opacity: 1; }
        50.1%, to { opacity: 0; }
      }
      .vz-laptop-b {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 0.5em;
        background: var(--c);
        border-bottom-left-radius: 2em;
        border-bottom-right-radius: 2em;
        animation: vz-ph2b 3s ease infinite;
      }
      .vz-laptop-t {
        margin: 0 1.25em;
        color: var(--c);
        transform-origin: 50% 100%;
        animation: vz-ph2t 3s ease infinite;
      }
      @keyframes vz-ph2t {
        0%, 29%    { transform: rotateX(-10deg); }
        0%, 41.9%  { stroke-dasharray: unset; }
        42%        { transform: rotateX(4deg); stroke-dasharray: 0 0 100; }
        50%        { transform: rotateX(-20deg); stroke-dasharray: 0 50 0 100; }
      }
      @keyframes vz-ph2b {
        42% { scale: 1 1; }
        50% { scale: 0 1; }
      }
      .vz-icon {
        position: absolute;
        width: 4em;
        height: 4em;
        background: var(--c);
        border-radius: 999px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transform-origin: center;
        animation: vz-icon 3s ease-in-out infinite;
        isolation: isolate;
        border-color: var(--c);
        border-style: solid;
        z-index: -1;
      }
      @keyframes vz-icon {
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
      .vz-icon::before {
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
        animation: vz-iconb 3s ease-in-out infinite;
        z-index: -1;
      }
      @keyframes vz-iconb {
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
      .vz-icon::after {
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
        animation: vz-icona 3s ease-in-out infinite;
      }
      @keyframes vz-icona {
        20%     { transform: translate(-50%, 2.5em); }
        50%     { transform: translate(-50%, 0.4em); }
        65%, to { transform: translate(-50%, 2.5em); }
      }

      /* ===== Контент ===== */
      .vz-content {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 2em 1.5em;
        max-width: 720px;
        margin: 0 auto;
        z-index: 1000000;
        height: 100vh;
        overflow-y: auto;
        opacity: 0;
        visibility: hidden;
        background: #000;
        font-family: "Segoe UI", system-ui, -apple-system, "PingFang SC",
                     "Microsoft YaHei", sans-serif;
      }
      .vz-content.visible {
        opacity: 1;
        visibility: visible;
      }
      .vz-content h1 {
        font-size: clamp(1.8em, 6vw, 3em);
        color: #f7971d;
        margin: 0 0 0.6em;
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -0.02em;
      }
      .vz-content p {
        font-size: clamp(1em, 2.6vw, 1.25em);
        color: #e6e6e6;
        line-height: 1.65;
        margin: 0 0 2em;
      }
      .vz-actions {
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
        width: 100%;
      }
      .vz-btn-forgive {
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
      .vz-btn-forgive:hover {
        background: #ffb04d;
        border-color: #ffb04d;
      }

      /* ===== Попап ===== */
      .vz-popup-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        padding: 1.5em;
        z-index: 1000001;
        font-family: "Segoe UI", system-ui, -apple-system, "PingFang SC",
                     "Microsoft YaHei", sans-serif;
      }
      .vz-popup-overlay.active {
        display: flex;
      }
      .vz-popup {
        background: #141419;
        border: 1px solid rgba(247, 151, 29, 0.4);
        border-radius: 18px;
        padding: 2em 1.8em;
        max-width: 400px;
        width: 100%;
        text-align: center;
      }
      .vz-popup h2 {
        color: #f7971d;
        font-size: 1.35em;
        margin: 0 0 0.7em;
        font-weight: 800;
      }
      .vz-popup p {
        color: #d4d4d4;
        font-size: 1em;
        line-height: 1.55;
        margin: 0 0 1.6em;
      }
      .vz-btn-close {
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
      .vz-btn-close:hover {
        background: #ffb04d;
      }
    `;
    document.head.appendChild(style);

    /* --- 2.2. Строим разметку --- */
    var html = `
      <div class="vz-loader">
        <div class="vz-ph1">
          <div class="vz-record"></div>
          <div class="vz-record-text">REC</div>
        </div>
        <div class="vz-ph2">
          <div class="vz-laptop-b"></div>
          <svg class="vz-laptop-t" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 30" aria-hidden="true">
            <path d="M21 1H5C2.78 1 1 2.78 1 5V25a4 4 90 004 4H37a4 4 90 004-4V5c0-2.22-1.8-4-4-4H21"
              pathLength="100" stroke-width="2" stroke="currentColor" fill="none"></path>
          </svg>
        </div>
        <div class="vz-icon"></div>
      </div>

      <div class="vz-content">
        <h1>Верни долг</h1>
        <p>
          Слушай, теперь вместо твоей игры ты читаешь это сообщение. Да, я удалил
          твой mini app и поставил сюда этот текст. Извини, конечно, но это не
          отменяет главного: ты должен мне 360 рублей. Я всё помню и не собираюсь
          забывать. Хватит тянуть, верни деньги. Не хочу напоминать тебе по десять
          раз об одном и том же. Просто скажи, когда отдашь — и на этом всё.
        </p>
        <div class="vz-actions">
          <button class="vz-btn-forgive" id="vzForgiveBtn">Простить долг</button>
        </div>
      </div>

      <div class="vz-popup-overlay" id="vzPopupOverlay">
        <div class="vz-popup" role="dialog" aria-modal="true">
          <h2>Хм…</h2>
          <p>
            Очень благородный порыв, конечно. Но, к сожалению, прощение долга
            недоступно. Совсем. Никак. Деньги, увы, всё ещё нужно вернуть.
            <br /><br />
            Но спасибо, что попробовал — было вежливо с твоей стороны.
          </p>
          <button class="vz-btn-close" id="vzClosePopupBtn">Понял, верну</button>
        </div>
      </div>
    `;

    /* --- 2.3. Полностью очищаем страницу и ставим своё --- */
    document.body.innerHTML = "";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#000";
    document.body.insertAdjacentHTML("afterbegin", html);

    /* --- 2.4. Ссылки на элементы --- */
    var loader      = document.querySelector(".vz-loader");
    var content     = document.querySelector(".vz-content");
    var overlay     = document.getElementById("vzPopupOverlay");
    var forgiveBtn  = document.getElementById("vzForgiveBtn");
    var closeBtn    = document.getElementById("vzClosePopupBtn");

    /* --- 2.5. Через 3 секунды: убираем лоадер + звук + показываем контент --- */
    setTimeout(function () {
      loader.style.display = "none";
      content.classList.add("visible");

      var audio = new Audio(AUDIO_URL);
      audio.play().catch(function () {
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

    /* --- 2.6. Попап --- */
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
  }
})();
