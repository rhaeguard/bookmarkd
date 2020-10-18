chrome.browserAction.onClicked.addListener(({ title, url }) => {
    const store = chrome.storage.sync;
    store.get(["bookmarkieDatabase"], ({ bookmarkieDatabase }) => {
        store.set(makeDbObj(bookmarkieDatabase, title, url));
    });
});

function makeDbObj(currentValueString, title, url) {
    let b = makeBookmarkObj(title, url);
    if (currentValueString) {
        const db = JSON.parse(currentValueString);
        if (doesNotContain(db.saved, b)) {
            db.saved.push(b);
        }
        return makeDbObj(db);
    } else {
        return makeDbObj({
            saved: [b],
        });
    }
}

function doesNotContain(items, {title, url}) {
    return !items
        .some(x => title === x.title && url === x.url && !x.done)
}

function makeBookmarkObj(title, url) {
    return {
        id: id(),
        title,
        url,
        done: false,
    };
}

function makeDbObj(obj) {
    return {
        bookmarkieDatabase: JSON.stringify(obj),
    };
}

function id() {
    const min = Math.ceil(100000000000);
    const max = Math.floor(999999999999);
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}