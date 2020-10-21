chrome.browserAction.onClicked.addListener(({ title, url }) => {
    const store = chrome.storage.sync;
    store.get(["bookmarkieDatabase"], ({ bookmarkieDatabase }) => {
        getMetaInfo(url, ({ image, description }) => {
            store.set(
                handleDbObj(bookmarkieDatabase, {
                    id: id(),
                    title,
                    url,
                    image,
                    description,
                    done: false,
                })
            );
        });
    });
});

function handleDbObj(currentValueString, bookmark) {
    if (currentValueString) {
        const db = JSON.parse(currentValueString);
        if (doesNotContain(db.saved, bookmark)) {
            db.saved.push(bookmark);
        }
        return makeDbObj(db);
    }
    return makeDbObj({
        saved: [bookmark],
    });
}

function doesNotContain(items, { title, url }) {
    return !items.some((x) => title === x.title && url === x.url && !x.done);
}

function makeBookmarkObj(title, url, image, description) {
    return {
        id: id(),
        title,
        url,
        image,
        description,
        done: false,
    };
}

function makeDbObj(obj) {
    return {
        bookmarkieDatabase: JSON.stringify(obj),
    };
}

function id() {
    const min = 100000000000;
    const max = 999999999999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}