// listen for messages from the popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting == "hello") {
        // get local storage data
        const localStorageData = JSON.stringify(localStorage);

        // send it to the background script
        sendResponse({localStorageData: localStorageData});
    }
    return true; // this line is necessary if the response is asynchronous
});