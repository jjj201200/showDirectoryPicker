This project is provided for testing `window.showDirectoryPicker` method in Manifest Version 3 Chrome Extension's offscreen document.

Step:
1. use git clone this repository, and install it in chrome with `load unzipped extension` button in [extension manage page](chrome://extensions)
2. click the `details` button, open the `offscreen.html` inspection window, and turn to `Console` tab in inspection window
3. click this extension icon in browser extension toolbar
4. waitting the dialog show and select a nonsystem directory

Expected result: a promise with `FileSystemDirectoryHandle`

Current result: a error `AbortError: Failed to execute 'showDirectoryPicker' on 'Window': The user aborted a request.`
