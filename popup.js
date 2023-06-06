// Function to create table from JSON data
function createTable(jsonData, tableId) {
    let table = document.getElementById(tableId);

    // Determine if jsonData contains objects or strings
    let isObject = jsonData[0] !== null && typeof jsonData[0] === 'object';

    let data = isObject ? Object.keys(jsonData[0]) : ["URL"];
    let tableHead = document.createElement('thead');
    let tableBody = document.createElement('tbody');
    let headRow = document.createElement('tr');

    // Create table header row
    data.forEach((key) => {
        let th = document.createElement('th');
        let text = document.createTextNode(key);
        th.appendChild(text);
        headRow.appendChild(th);
    });
    tableHead.appendChild(headRow);

    // Create table body rows
    jsonData.forEach((element, index) => {
        let tr = document.createElement('tr');
        data.forEach((key) => {
            let td = document.createElement('td');
            let text = document.createTextNode(isObject ? element[key] || '' : element);
            td.appendChild(text);
            tr.appendChild(td);
        });

        // Hide rows that are above the 10th index
        if (index >= 10) {
            tr.style.display = 'none';
        }
        tableBody.appendChild(tr);
    });

    table.appendChild(tableHead);
    table.appendChild(tableBody);

    // Create the 'Show More' button and add the event listener
    if (jsonData.length > 10) {
        let showMoreBtn = document.createElement('button');
        showMoreBtn.innerHTML = 'Show More';
        showMoreBtn.addEventListener('click', function() {
            let rows = tableBody.getElementsByTagName('tr');
            for (let i = 10; i < rows.length; i++) {
                rows[i].style.display = '';
            }
            showMoreBtn.style.display = 'none';  // Hide the button
        });
        table.parentNode.insertBefore(showMoreBtn, table.nextSibling);
    }
}

// Send a message to the background script
browser.runtime.sendMessage({greeting: "hello"}, function(response) {
    // handle the cookie data
    createTable(response.data, 'cookie-table');

    // handle the local storage data
    let localStorageData = JSON.parse(response.localStorageData);
    let formattedLocalStorageData = Object.keys(localStorageData).map((key) => ({
        key: key,
        value: localStorageData[key]
    }));
    createTable(formattedLocalStorageData, 'storage-table');

    // handle the third-party connections
    createTable(response.thirdPartyConnections, 'thirdparty-table');

    // handle the potential cookie syncs
    createTable(response.potentialCookieSyncs, 'cookiesync-table');

    // create a summary
    let summary = `
    Cookies found: ${response.data.length}<br/>
    Local Storage items found: ${Object.keys(localStorageData).length}<br/>
    Third Party connections: ${response.thirdPartyConnections.length}<br/>
    Potential Cookie Synchronizations: ${response.potentialCookieSyncs.length}
    `;
    document.getElementById('summary').innerHTML = summary;
});
