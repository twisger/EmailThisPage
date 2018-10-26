function saveOptions() {
    const serverURL = document.getElementById('serverURL').value
    chrome.storage.sync.set({
        serverURL: serverURL,
    }, function () {
        alert('Options saved.')
    })
}
function restore_options() {
    chrome.storage.sync.get({
        serverURL: 'http://localhost:2233',
    }, function (items) {
        document.getElementById('serverURL').value = items.serverURL
    })
}
document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('save').addEventListener('click',
    saveOptions)