chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "click-img",
    title: "What the prompt?",
    contexts: ["image"],
  },
    () => void chrome.runtime.lastError,
  );
});

let portFromCS;

function onConnected(port) {
  portFromCS = port;
}

chrome.runtime.onConnect.addListener(onConnected);

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "click-img") {
    // as we set `contexts: ["image"]` above, we can assume that `info.srcUrl` is an image url
    console.log('clicked on image', info.srcUrl);

    portFromCS.postMessage({ type: "openPopup" });

    const timeoutId = setTimeout(() => {
      portFromCS.postMessage({ type: "timeout" });
    }, 29000);

    console.log(timeoutId);

    return fetch('https://image-prompting-server-tqjpqri67a-lz.a.run.app/describe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: info.srcUrl})
    })
    .then((response) => {
      response.json().then((data) => {
        return portFromCS.postMessage({ type: "finish", value: data.value });
      });
    }).catch((error) => {
      return portFromCS.postMessage({ type: "error", value: error.message });
    }).finally(() => {
      clearTimeout(timeoutId);
    });
  }
});
