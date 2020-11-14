import { withStore, makeDbObj } from "./Utils";

export function markAsFeatured(bookmarkId: string) {
    withStore((store, bookmarks) => {
        const b = bookmarks.find((x) => x.id === bookmarkId && !x.done);
        const newBookmarks = bookmarks.filter((x) => x.id !== bookmarkId);
        store.set(makeDbObj([b!!, ...newBookmarks]));
    });
}

export function markAsDone(bookmarkId: string, callback: () => void) {
    withStore((store, bookmarks) => {
        for (let b of bookmarks) {
            if (b.id === bookmarkId) {
                b.done = true;
            }
        }
        store.set(makeDbObj(bookmarks), callback);
    });
}

export function markAsUndone(bookmarkId: string, callback: () => void) {
    withStore((store, bookmarks) => {
        for (let b of bookmarks) {
            if (b.id === bookmarkId) {
                b.done = false;
            }
        }
        store.set(makeDbObj(bookmarks), callback);
    });
}

export function deleteBookmark(bookmarkId: string, callback: () => void) {
    withStore((store, bookmarks) => {
        store.set(
            makeDbObj(bookmarks.filter((x) => x.id !== bookmarkId)),
            callback
        );
    });
}
