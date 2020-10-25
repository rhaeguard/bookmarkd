/*global chrome*/
/*exported makeElement, makeAnchor, makeDbObj, withStore, getShowHideElement */

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

function makeElement(type, classes, attributes = {}, children = []) {
    const e = document.createElement(type);
    e.className = classes;

    for (let key in attributes) {
        const value = attributes[key];
        e.setAttribute(key, value);
    }

    for (let child of children) {
        e.appendChild(child);
    }

    return e;
}

function makeAnchor(classes, title, url, id) {
    return makeElement(
        "a",
        classes,
        {
            href: url,
            id: id,
        },
        [document.createTextNode(title)]
    );
}
