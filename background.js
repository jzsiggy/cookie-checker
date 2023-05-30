let thirdPartyConnections = [];

function logURL(requestDetails) {
  console.log("Loading: " + requestDetails.url);
  thirdPartyConnections.push(requestDetails.url)
}

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  { urls: ["<all_urls>"] }
);

// listen for messages from the popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.greeting == "hello") {
      // forward the message to the content script
      browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
          let activeTab = tabs[0];
          browser.tabs.sendMessage(activeTab.id, {greeting: "hello"}, (response) => {
              // gather your data here and send it as a response
              browser.cookies.getAll({}).then((cookies) => {
                  sendResponse({data: cookies, localStorageData: response.localStorageData, thirdPartyConnections});
              });
          });
      });
      return true; // this line is necessary if the response is asynchronous
  }
});
