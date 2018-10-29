let activeTab = ''

chrome.runtime.onInstalled.addListener(function () {
    // Create one test item for each context type.
    chrome.contextMenus.create({
        id: 'EmailThisPage', title: "Email This Page"
    }, function () {
        if (chrome.extension.lastError) {
            console.error("Got expected error: " + chrome.extension.lastError.message);
        }
    })
});

const onClickHandler = (info, tab) => {
    activeTab = tab
    if (info.menuItemId === 'EmailThisPage') {
        chrome.tabs.executeScript({
            file: "js/getPageSource.js"
        }, function () {
            // If you try and inject into an extensions page or the webstore/NTP you'll get an error
            if (chrome.runtime.lastError) {
                console.error('There was an error injecting script : \n' + chrome.runtime.lastError.message)
            }
        });
    }
}
chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        chrome.storage.sync.get({
            serverURL: 'http://localhost:2333',
        }, function (items) {
            chrome.pageCapture.saveAsMHTML({ tabId: activeTab.id }, (mhtmlBinary) => {
                const xhr = new XMLHttpRequest()
                const formData = new FormData()
                formData.append("attachments", mhtmlBinary, request.title + '.mhtml')
                formData.append('title', request.title)
                formData.append('content', request.source)
                xhr.open("POST", items.serverURL, true)
                xhr.send(formData)
                xhr.onreadystatechange = () => {
                    const  { readyState, status } = xhr
                    if (readyState === 4) {
                        if (status >= 200 && status < 300 || status === 0) {
                            console.log('Save Success!')
                        } else {
                            alert('Failed to send request to url ' + items.serverURL + ', check the configuration of transmission server.')
                        }
                    } 
                }
            })
        })

    }
});

