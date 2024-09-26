setInterval(async () => chrome.runtime.sendMessage('keepAlive'), 20e3);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'showDirectoryPicker') {
        window.showDirectoryPicker()
              .then(res => console.log(res))
              .catch(error => console.log(error));
    }
    return true;
});
