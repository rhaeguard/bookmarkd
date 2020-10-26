/*global chrome, uuidv4, getMetaInfo*/

function doesNotContain(items, { title, url }) {
    return !items.some((x) => title === x.title && url === x.url && !x.done);
}

function handleDbObj(currentValueString, bookmark) {
    const makeDbObj = (obj) => {
        return { bookmarkieDatabase: JSON.stringify(obj) };
    };

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

chrome.browserAction.onClicked.addListener(({ title, url }) => {
    const store = chrome.storage.sync;
    store.get(["bookmarkieDatabase"], ({ bookmarkieDatabase }) => {
        getMetaInfo(url, ({ image, description }) => {
            store.set(
                handleDbObj(bookmarkieDatabase, {
                    id: uuidv4(),
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
