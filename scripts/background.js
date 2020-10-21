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
    const min = Math.ceil(100000000000);
    const max = Math.floor(999999999999);
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

// parser part
const parser = new DOMParser();

function getMetaInfo(url, callback) {
    fetch(url)
        .then((res) => res.text())
        .then(retrieveMetaFromHtmlText)
        .then((info) => callback(info))
        .catch((reason) => console.log(reason));
}

function retrieveMetaFromHtmlText(htmlText) {
    const defaultIfNull = (obj) => {
        if (obj) {
            return obj.content;
        }
        return null;
    }

    const dom = parser.parseFromString(htmlText, "text/html");

    const description = defaultIfNull(
        dom.querySelector('meta[property="og:description"]')
    );
    const image = defaultIfNull(
        dom.querySelector('meta[property="og:image"]')
    );

    return {
        description,
        image,
    };
}

