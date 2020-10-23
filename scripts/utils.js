/*global chrome*/

function onClick(id, callback) {
    document.getElementById(id).addEventListener("click", () => callback());
}

function setHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

function makeDbObj(obj) {
    return {
        bookmarkieDatabase: JSON.stringify({
            saved: obj,
        }),
    };
}

function withStore(callback) {
    const store = chrome.storage.sync;
    store.get(null, ({ bookmarkieDatabase }) => {
        const oldBookmarks = JSON.parse(bookmarkieDatabase).saved;
        callback(store, oldBookmarks);
    });
}

function getShowHideElement() {
    return document.getElementById("showHideDone");
}
