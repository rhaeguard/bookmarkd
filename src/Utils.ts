/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
export function makeDbObj(obj: Bookmarked[]): BookmarkedDbObject {
    return {
        bookmarkieDatabase: JSON.stringify({
            saved: obj,
        }),
    };
}

export function parseNow(input: string): {
    saved: Bookmarked[]
} {
    return JSON.parse(input);
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
