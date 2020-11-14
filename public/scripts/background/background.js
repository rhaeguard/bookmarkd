/* eslint-disable no-labels */
/* eslint-disable no-unused-labels */
/* eslint-disable no-undef */
const ba = chrome.browserAction;
const t = chrome.tabs;

function handleDbObj(currentValueString, bookmark) {
    // eslint-disable-next-line no-labels
    // eslint-disable-next-line no-restricted-syntax
    const makeDbObj = (obj) => { bookmarkieDatabase: JSON.stringify(obj); };

    const doesNotContain = (items, { title, url }) => !items.some(
        (x) => title === x.title && url === x.url && !x.done,
    );

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

function greyOutIcon() {
    ba.setIcon({
        path: "icons/gr_16.png",
    });
}

function resetIcon(tabId) {
    ba.setIcon({
        path: "icons/16.png",
    });
    ba.setPopup({
        tabId,
        popup: "",
    });
}

function popAlreadyBookmarked(tabId) {
    ba.setPopup({
        tabId,
        popup: "html/alreadyBookmarked.html",
    });
}

function withStore(callback) {
    const store = chrome.storage.sync;
    store.get(["bookmarkieDatabase"], ({ bookmarkieDatabase }) => {
        callback(store, bookmarkieDatabase);
    });
}

ba.onClicked.addListener(({ tabId, title, url }) => {
    withStore((store, bookmarkieDatabase) => {
        getMetaInfo(url, ({ image, description }) => {
            store.set(
                handleDbObj(bookmarkieDatabase, {
                    id: uuidv4(),
                    title,
                    url,
                    image,
                    description,
                    done: false,
                }),
                () => {
                    greyOutIcon();
                    popAlreadyBookmarked(tabId);
                },
            );
        });
    });
});

function checkIfAlreadyBookmarked(tabId, url) {
    withStore((store, bookmarkieDatabase) => {
        if (bookmarkieDatabase) {
            const bookmarks = JSON.parse(bookmarkieDatabase).saved;
            const alreadyBooked = bookmarks
                .filter((x) => !x.done)
                .some((x) => url === x.url);

            if (alreadyBooked) {
                greyOutIcon();
                popAlreadyBookmarked(tabId);
            } else {
                resetIcon(tabId);
            }
        }
    });
}

t.onUpdated.addListener((tabId, _ci, { url }) => {
    checkIfAlreadyBookmarked(tabId, url);
});

t.onActivated.addListener(({ tabId }) => {
    t.get(tabId, ({ url }) => {
        checkIfAlreadyBookmarked(tabId, url);
    });
});
