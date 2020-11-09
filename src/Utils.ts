export function makeDbObj(obj: Bookmarked[]): BookmarkedDbObject {
    return {
        bookmarkieDatabase: JSON.stringify({
            saved: obj,
        }),
    };
}

export function withStore(callback: (store: chrome.storage.StorageArea, bookmarks: Bookmarked[]) => void) {
    const store = chrome.storage.sync;
    store.get(["bookmarkieDatabase"], ({ bookmarkieDatabase }) => {
        const bookmarks: Bookmarked[] = JSON.parse(bookmarkieDatabase).saved
        callback(store, bookmarks);
    });
}

export function parseNow(input: string): {
    saved: Bookmarked[]
} {
    return JSON.parse(input)
}

export interface BookmarkedDbObject {
    bookmarkieDatabase: string
}

export interface Bookmarked {
    id: string,
    title: string,
    url: string,
    done: boolean,
    description: string
}