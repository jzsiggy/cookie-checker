// send a message to the background script
browser.runtime.sendMessage({greeting: "hello"}, function(response) {
    // handle the cookie data
    let cookieData = response.data;
    document.getElementById('cookie-content').textContent = JSON.stringify(cookieData, null, 2);
    
    // handle the local storage data
    let localStorageData = JSON.parse(response.localStorageData);
    document.getElementById('storage-content').textContent = JSON.stringify(localStorageData, null, 2);
});