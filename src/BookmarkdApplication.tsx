import "./BookmarkdApplication.css";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css";
import React, { useState, useEffect } from 'react'
import { Collection } from "react-materialize";
import BookmarkItem from "./components/BookmarkItem";
import { Bookmarked, makeDbObj, parseNow } from "./Utils";
import { FeaturedBookmarkItem } from "./components/FeaturedBookmarkItem";
import { ReactSortable } from "react-sortablejs";
import DoneBookmarkItem from "./components/DoneBookmarkItem";
import { Fab, Action } from "react-tiny-fab";

const NoBookmarks = () => (<p className="center">no bookmarks</p>)

export default function BookmarkdApplication() {

    const [bookmarks, setBookmarks] = useState<Bookmarked[]>([]);
    const [doneBookmarks, setDoneBookmarks] = useState<Bookmarked[]>([]);
    const [featured, setFeatured] = useState<Bookmarked | undefined>(undefined);
    const [noBookmarks, setNoBookmarks] = useState<boolean>(true);
    const [hideDoneBookmarks, setHideDoneBookmarks] = useState<boolean>(true);

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
                const [featuredBookmark, ...rest] = saved.filter(b => !b.done);
                setFeatured(featuredBookmark);
                setBookmarks(rest);

                setDoneBookmarks(saved.filter(b => b.done));
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

    function rearrange(newOrderBookmarks: Bookmarked[], featured: Bookmarked) {
        if (newOrderBookmarks.length === 0) return;

        // get the current order of ids
        const ids = [...newOrderBookmarks].map((e) => e.id);

        // featured won't be affected, it will be the first anyway
        const featuredId = featured.id;

        chrome.storage.sync.get(null, ({ bookmarkieDatabase }) => {
            // logic is as follows:
            // separate done, undone and featured from all
            // put in the order: featured, undone, done
            // where, undone elements will be ordered based on the current order of ids.

            const allBookmarks: Bookmarked[] = JSON.parse(bookmarkieDatabase).saved;

            const onlyUndone = allBookmarks.filter((x) => !x.done);
            const onlyDone = allBookmarks.filter((x) => x.done);

            const featured = onlyUndone.find((x) => x.id === featuredId)!; // todo: bad
            const others = onlyUndone.filter((x) => x.id !== featuredId);

            const newBookmarks: Bookmarked[] = ids.map((id) =>
                others.find((x) => x.id === id)! // todo: bad
            );

            const arr: Bookmarked[] = [featured, ...newBookmarks, ...onlyDone];

            chrome.storage.sync.set(makeDbObj(arr));
        });
    }

    function renderBodyItems(featured: Bookmarked, bookmarks: Bookmarked[]) {
        return (
            <ReactSortable list={bookmarks} setList={setBookmarks} onEnd={() => {
                rearrange(bookmarks, featured!);
            }}>
                {bookmarks.map((b) => {
                    return (
                        <BookmarkItem {...b}
                            onDoneSuccess={refreshItems}
                            onDeleteSuccess={refreshItems}
                        />
                    )
                })}
            </ReactSortable>
        )
    }

    const renderUndoneBookmarks = () => {
        if (noBookmarks || !featured) {
            return <NoBookmarks />
        } else {
            return (
                <React.Fragment>
                    <FeaturedBookmarkItem {...featured!}
                        onDoneSuccess={refreshItems}
                        onDeleteSuccess={refreshItems} />
                    <Collection >
                        {
                            bookmarks.length === 0
                                ? <NoBookmarks />
                                : renderBodyItems(featured!, bookmarks)
                        }
                    </Collection>
                </React.Fragment>
            )
        }
    }

    const renderDoneBookmarks = () => {
        return hideDoneBookmarks ? null : (
            <Collection>
                {
                    doneBookmarks.map(b => {
                        return (<DoneBookmarkItem {...b}
                            onUndoneSuccess={refreshItems}
                            onDeleteSuccess={refreshItems} />)
                    })
                }
            </Collection>
        )
    }

    const renderFloatingToolbar = () => {
        const style = {
            backgroundColor: "#e57b1e"
        };
        return (
            <Fab
                mainButtonStyles={style}
                icon={<i className="material-icons">help_outline</i>}
                alwaysShowTitle={true}
            >
                <Action
                    style={style}
                    text={hideDoneBookmarks ? "Show done bookmarks" : "Hide done bookmarks"}
                    onClick={() => {
                        setHideDoneBookmarks(!hideDoneBookmarks)
                    }}
                >
                    <i className="material-icons">history</i>
                </Action>
            </Fab>
        )
    }

    return (
        <div className="app">
            <h1 className="center-align app-title">bookmarkd</h1>

            <div className="container">
                {renderUndoneBookmarks()}
                {renderDoneBookmarks()}
            </div>

            {renderFloatingToolbar()}
        </div>
    );
}