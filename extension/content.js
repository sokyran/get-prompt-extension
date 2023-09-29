const listenForThePopupMove = () => {
  const el = document.querySelector(".popup");

  let newPosX = 0, newPosY = 0, startPosX = 0, startPosY = 0;

  const mouseDownHandler = function (e) {
    newPosX = e.clientX;
    newPosY = e.clientY;
    startPosX = el.offsetLeft;
    startPosY = el.offsetTop;

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  const mouseMoveHandler = function (e) {
    const dx = e.clientX - newPosX;
    const dy = e.clientY - newPosY;

    el.style.left = startPosX + dx + 'px';
    el.style.top = startPosY + dy + 'px';
  }

  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }

  el.addEventListener('mousedown', mouseDownHandler);
}

const main = () => {
  let isFinished = false;
  let interval = null;

  const loadingPhrases = [
    'Damn, this is taking a while...',
    'I\'m still thinking...',
    'Should take a few more seconds...',
    'If it feels like it\'s taking a while, try reloading the page.',
    'But I\'m still trying my best...',
  ];

  let myPort = chrome.runtime.connect({ name: "port-from-cs" });

  myPort.onMessage.addListener((m) => {
    const resultText = document.querySelector("#resultText");
    const loadingText = document.querySelector("#loadingText");

    if (m.type === "finish") {
      isFinished = true;
      clearInterval(interval);

      loadingText.textContent = "";
      resultText.textContent = m.value;
    } else if (m.type === "error") {
      clearInterval(interval);

      loadingText.textContent = m.value;
      resultText.textContent = "";
    } else if (m.type === "openPopup") {
      popup.style.display = "block";

      loadingText.textContent = "Loading...";
      resultText.textContent = "";

      interval = setInterval(() => {
        if (isFinished || loadingPhrases.length === 0) {
          clearInterval(interval);
          return;
        }
        loadingText.textContent = loadingText.textContent + `\n${loadingPhrases.shift()}`;
      }, 5000);
    } else if (m.type = "timeout") {
      clearInterval(interval);

      loadingText.textContent = "It's taking a while, try reloading the page.";
      resultText.textContent = "";
    }
  });

  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.classList.add("image-wizard");

  const imgSrc = chrome.runtime.getURL("images/wizard.png");
  const closeIcon = chrome.runtime.getURL("images/close-icon.svg");
  const copyIcon = chrome.runtime.getURL("images/copy-icon.svg");
  const openIcon = chrome.runtime.getURL("images/open-icon.svg");

  popup.innerHTML = `
    <div class="top-bar">
      <img id="close" width="20" height="20" class="close" src=${closeIcon} alt="Close" />
    </div>
    <div class="content">
      <img width="32" height="32" class="logo" src=${imgSrc} alt="" />
      <div>
        <div class="text-container">
          <div id="loadingText" class="text"></div>
          <div id="resultText" class="text"></div>
        </div>
        <div class="button-container">
          <button id="copy-text" class="copy-button">
            <img src=${copyIcon} alt="Copy" />
          </button>
          <button id="open-imagewizard" class="open-button">
            Try prompt in Image Wizard
            <img src=${openIcon} class="open-icon" alt="" />
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  const close = document.querySelector("#close");
  close.addEventListener('click', function () {
    popup.style.display = "none";
  });

  const openWizard = document.querySelector("#open-imagewizard");
  openWizard.addEventListener('click', function () {
    const resultText = document.querySelector("#resultText");
    window.open(`imagewizard://?prompt=${resultText.textContent}`);
  });

  const copyText = document.querySelector("#copy-text");
  copyText.addEventListener('click', function () {
    const resultText = document.querySelector("#resultText");
    navigator.clipboard.writeText(resultText.textContent);
  });

  listenForThePopupMove();
}

main();
