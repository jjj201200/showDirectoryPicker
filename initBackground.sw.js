let creating = undefined; // A global promise to avoid concurrency issues

const getOffscreenDocument = async function(url, reasons, justification) {
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path.
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        documentUrls: [url],
    });

    if (existingContexts.length > 0) {
        return existingContexts;
    }

    // create offscreen document
    if (creating !== undefined) {
        creating = null;
        return await getOffscreenDocument(url, reasons, justification);
    } else {
        creating = await chrome.offscreen.createDocument({
            url,
            reasons,
            justification,
        });
        creating = null;
        return await getOffscreenDocument(url, reasons, justification);
    }
};

const createBackgroundOffscreenDocument = async function() {
    return await getOffscreenDocument(
        chrome.runtime.getURL('offscreen.html'),
        [
            chrome.offscreen.Reason.CLIPBOARD,
            chrome.offscreen.Reason.LOCAL_STORAGE,
            chrome.offscreen.Reason.IFRAME_SCRIPTING,
            chrome.offscreen.Reason.DOM_SCRAPING,
            chrome.offscreen.Reason.BLOBS,
        ],
        'keep service worker running',
    ).catch(e => console.error(e));
};

/* create offscreen document */
chrome.runtime.onStartup.addListener(createBackgroundOffscreenDocument);
void createBackgroundOffscreenDocument().catch(e => console.error(e));

/* send a message to offscreen document and make it to alive. */
const backgroundServiceMessageCallback = (message, sender, sendResponse) => {
    if (message === 'keepAlive') {
        return true;
    }
};
chrome.runtime.onMessage.addListener(backgroundServiceMessageCallback);

/* bind popup click event */
chrome.action.onClicked.addListener(() => {
    chrome.runtime.sendMessage({command: 'showDirectoryPicker'});
});
