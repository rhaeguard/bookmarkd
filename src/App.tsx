import "./App.css";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css";
import React, { useState, useEffect } from 'react'
import { Collection } from "react-materialize";
import BookmarkItem from "./components/BookmarkItem";
import { Bookmarked, parseNow } from "./Utils";
import { FeaturedBookmarkItem } from "./components/FeaturedBookmarkItem";

export default function App() {

    const [bookmarks, setBookmarks] = useState<Bookmarked[]>([]);
    const [featured, setFeatured] = useState<Bookmarked | undefined>(undefined);
    const [noBookmarks, setNoBookmarks] = useState<boolean>(true);

    function refreshItems() {
        chrome.storage.sync.get(({ bookmarkieDatabase }) => {
            displayItems(bookmarkieDatabase)
        })
    }

    function displayItems(bookmarkieDatabase: string) {
        let noBookmarks: boolean;
        if (bookmarkieDatabase) {
            const { saved } = parseNow(bookmarkieDatabase)
            noBookmarks = saved.length === 0;
            if (!noBookmarks) {
                const [featuredBookmark, ...rest] = saved.filter(b => !b.done)
                setFeatured(featuredBookmark)
                setBookmarks(rest)
            }
        } else {
            noBookmarks = true;
        }
        setNoBookmarks(noBookmarks)
    }

    useEffect(refreshItems, [])

    useEffect(() => {
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (["local", "sync"].includes(areaName)) {
                const dbStr = changes.bookmarkieDatabase.newValue;
                displayItems(dbStr)
            }
        })
    }, [])

    function renderBody(featured: Bookmarked | undefined, bookmarks: Bookmarked[], noBooks: boolean) {
        if (noBooks) {
            return (<p className="center">no bookmarks</p>)
        } else {
            return (<div>
                <FeaturedBookmarkItem {...featured!!}
                    onDoneSuccess={refreshItems}
                    onDeleteSuccess={refreshItems} />
                <Collection >
                    {bookmarks.map((b) => {
                        return (
                            <BookmarkItem {...b}
                                onDoneSuccess={refreshItems}
                                onDeleteSuccess={refreshItems}
                            />
                        )
                    })}
                </Collection>
            </div>)
        }
    }

    return (
        <div className="App">
            <h1 className="center-align app-title">bookmarkd</h1>

            <div className="container" id="root">
                {renderBody(featured, bookmarks, noBookmarks)}
                <div id="doneItems"></div>
            </div>
        </div>
    );
}