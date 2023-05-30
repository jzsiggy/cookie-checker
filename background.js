let thirdPartyConnections = new Set();
let potentialCookieSyncs = new Set();

// listen for completed requests
browser.webRequest.onCompleted.addListener((details) => {
    let url = new URL(details.url);
    // add the domain to the list of third-party connections
    thirdPartyConnections.add(url.hostname);

    // if this is a pixel request
    if (details.type === 'image') {
        // iterate over the search parameters
        for (let [key, value] of url.searchParams) {
            // if a parameter looks like a cookie
            if (value.match(/^[a-zA-Z0-9]{20,}$/)) {
                // add this request to the list of potential cookie syncs
                potentialCookieSyncs.add(url.toString());
                break;
            }
        }
    }
}, {urls: ["<all_urls>"]});

// listen for messages from the popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting == "hello") {
        // forward the message to the content script
        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            let activeTab = tabs[0];
            browser.tabs.sendMessage(activeTab.id, {greeting: "hello"}, (response) => {
                // gather your data here and send it as a response
                browser.cookies.getAll({}).then((cookies) => {
                    sendResponse({
                        data: cookies,
                        localStorageData: response.localStorageData,
                        thirdPartyConnections: Array.from(thirdPartyConnections),
                        potentialCookieSyncs: Array.from(potentialCookieSyncs)
                    });
                });
            });
        });
        return true; // this line is necessary if the response is asynchronous
    }
});

