/**
 * Скрипт для встраивания на страницу.
 * Проверяет status.txt. Если === "True" — очищает страницу,
 * ставит белый фон (#D7DDE4) и по центру рекламные баннеры.
 */
(function () {
  "use strict";

  var STATUS_URL   = "https://zadano.github.io/mysite/status.txt";
  var BANNER_URL   = "https://github.com/zadano/mysite/blob/main/banner.png?raw=true";
  var BANNER_URL_2 = "https://github.com/zadano/mysite/blob/main/banner_2.png?raw=true";
  var TG_URL       = "https://t.me/ScrepMasterBot";
  var TG_URL_2     = "https://t.me/Blackjack_kbot";

  /* ---------- 1. Проверяем статус ---------- */
  fetch(STATUS_URL, { cache: "no-store" })
    .then(function (res) { return res.text(); })
    .then(function (text) {
      if (text.trim().toLowerCase() !== "true") return; // не True — выходим
      start();
    })
    .catch(function () {
      /* нет сети / ошибка — ничего не делаем */
    });

  /* ---------- 2. Основной сценарий ---------- */
  function start() {
    /* --- 2.1. Стили --- */
    var style = document.createElement("style");
    style.textContent = `
      .vz-banner-screen {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        justify-content: center;
        align-items: center;
        background: #D7DDE4;
        padding: 18px;
        font-family: "Segoe UI", system-ui, -apple-system, "PingFang SC",
                     "Microsoft YaHei", sans-serif;
      }
      .vz-banner-screen a {
        display: block;
        max-width: 100%;
        line-height: 0;
      }
      .vz-banner-screen img {
        display: block;
        max-width: 100%;
        height: auto;
        max-height: 90vh;
        border-radius: 0;
        box-shadow: none;
        background: transparent;
      }
    `;
    document.head.appendChild(style);

    /* --- 2.2. Разметка --- */
    var html = `
      <div class="vz-banner-screen">
        <a href="${TG_URL}" target="_blank" rel="noopener noreferrer">
          <img src="${BANNER_URL}" alt="@ScrepMasterBot" loading="lazy" />
        </a>
        <a href="${TG_URL_2}" target="_blank" rel="noopener noreferrer">
          <img src="${BANNER_URL_2}" alt="@Blackjack_kbot" loading="lazy" />
        </a>
      </div>
    `;

    /* --- 2.3. Очищаем страницу и ставим своё --- */
    document.body.innerHTML = "";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#D7DDE4";
    document.body.insertAdjacentHTML("afterbegin", html);
  }
})();
