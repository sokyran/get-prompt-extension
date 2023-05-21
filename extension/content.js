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

  let myPort = browser.runtime.connect({ name: "port-from-cs" });

  myPort.onMessage.addListener((m) => {
    if (m.type === "finish") {
      isFinished = true;

      console.log('got image url', m.value);

      clearInterval(interval);

      const resultText = document.querySelector("#resultText");
      const loadingText = document.querySelector("#loadingText");

      loadingText.textContent = "";
      resultText.textContent = m.value;
    } else if (m.type === "error") {
      console.log('got error', m.value);
      text.textContent = m.value;
    } else if (m.type === "openPopup") {
      popup.style.display = "block";
      const text = document.querySelector("#loadingText");
      const resultText = document.querySelector("#resultText");

      text.textContent = "Loading...";
      resultText.textContent = "";

      const interval = setInterval(() => {
        if (isFinished || loadingPhrases.length === 0) {
          clearInterval(interval);
          return;
        }
        text.textContent = text.textContent + `\n${loadingPhrases.shift()}`;
      }, 5000);

    }
  });

  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.classList.add("image-wizard");

  const imgSrc = browser.runtime.getURL("images/wizard.png");
  const closeIcon = browser.runtime.getURL("images/close-icon.svg");
  const copyIcon = browser.runtime.getURL("images/copy-icon.svg");
  const openIcon = browser.runtime.getURL("images/open-icon.svg");

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
          <button id="open-midj" class="open-button">
            Try prompt in Midjourney
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

  const openMidj = document.querySelector("#open-midj");
  openMidj.addEventListener('click', function () {
    window.open("https://discord.com/channels/662267976984297473/1008571209685925920");
  });

  const copyText = document.querySelector("#copy-text");
  copyText.addEventListener('click', function () {
    const resultText = document.querySelector("#resultText");
    navigator.clipboard.writeText(resultText.textContent);
  });

  listenForThePopupMove();
}

main();
