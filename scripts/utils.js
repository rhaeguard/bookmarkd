/*global chrome*/
/*exported onClick, setHtml, makeDbObj, withStore, getShowHideElement */

function onClick(id, callback) {
    document.getElementById(id).addEventListener("click", () => callback());
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
