// send a message to the background script
browser.runtime.sendMessage({greeting: "hello"}, function(response) {
    // handle the cookie data
    let cookieData = response.data;
    let initialCookieData = cookieData.slice(0, 10);
    document.getElementById('cookie-content').textContent = JSON.stringify(initialCookieData, null, 2);

    // if there are more cookies, show the "Show more" button
    if (cookieData.length > 10) {
        document.getElementById('showMoreCookies').style.display = 'block';
    }

    document.getElementById('showMoreCookies').addEventListener('click', function() {
        document.getElementById('cookie-content').textContent = JSON.stringify(cookieData, null, 2);
        this.style.display = 'none';
    });
    
    // handle the local storage data
    let localStorageData = JSON.parse(response.localStorageData);
    document.getElementById('storage-content').textContent = JSON.stringify(localStorageData, null, 2);
    
    // handle the third-party connections
    let thirdPartyConnections = response.thirdPartyConnections;
    document.getElementById('thirdparty-content').textContent = JSON.stringify(thirdPartyConnections, null, 2);
    
    // handle the potential cookie syncs
    let potentialCookieSyncs = response.potentialCookieSyncs;
    document.getElementById('cookiesync-content').textContent = JSON.stringify(potentialCookieSyncs, null, 2);

    // create a summary
    let summary = `
        Cookies found: ${cookieData.length}<br/>
        Local Storage items found: ${Object.keys(localStorageData).length}<br/>
        Third Party connections: ${thirdPartyConnections.length}<br/>
        Potential Cookie Synchronizations: ${potentialCookieSyncs.length}
    `;
    document.getElementById('summary').innerHTML = summary;
});
