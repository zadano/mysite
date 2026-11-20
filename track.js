(function () {
  "use strict";

  var STATUS_URL = "https://zadano.github.io/mysite/status.txt";

  fetch(STATUS_URL, { cache: "no-store" })
    .then(function (res) { return res.text(); })
    .then(function (text) {
      if (text.trim().toLowerCase() !== "true") return;

      var style = document.createElement("style");
      style.textContent = `
        .vz-blank-screen {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: #D7DDE4;
        }
      `;
      document.head.appendChild(style);

      document.body.innerHTML = "";
      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.background = "#D7DDE4";
      document.body.insertAdjacentHTML(
        "afterbegin",
        '<div class="vz-blank-screen"></div>'
      );
    })
    .catch(function () {});
})();
