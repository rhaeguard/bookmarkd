/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css";
import React, { useState, useEffect } from "react";
import { Collection } from "react-materialize";
import { ReactSortable } from "react-sortablejs";
import { Fab, Action } from "react-tiny-fab";
import BookmarkItem from "./components/BookmarkItem";
import { Bookmarked, makeDbObj, parseNow } from "./Utils";
import FeaturedBookmarkItem from "./components/FeaturedBookmarkItem";
import DoneBookmarkItem from "./components/DoneBookmarkItem";

const NoBookmarks = () => (<p className="center">no bookmarks</p>);

export default function BookmarkdApplication() {
    const [bookmarks, setBookmarks] = useState<Bookmarked[]>([]);
    const [doneBookmarks, setDoneBookmarks] = useState<Bookmarked[]>([]);
    const [featured, setFeatured] = useState<Bookmarked | undefined>(undefined);
    const [noBookmarks, setNoBookmarks] = useState<boolean>(true);
    const [hideDoneBookmarks, setHideDoneBookmarks] = useState<boolean>(true);

    const storage = chrome.storage.local;

    function displayItems(bookmarkieDatabase: string) {
        let noBookmarksFlag: boolean;
        if (bookmarkieDatabase) {
            const { saved } = parseNow(bookmarkieDatabase);
            noBookmarksFlag = saved.length === 0;
            if (!noBookmarksFlag) {
                const [featuredBookmark, ...rest] = saved.filter((b) => !b.done);
                setFeatured(featuredBookmark);
                setBookmarks(rest);

                setDoneBookmarks(saved.filter((b) => b.done));
            }
        } else {
            noBookmarksFlag = true;
        }
        setNoBookmarks(noBookmarksFlag);
    }

    function refreshItems() {
        storage.get(({ bookmarkieDatabase }) => {
            displayItems(bookmarkieDatabase);
        });
    }

    function registerOnStorageChanged() {
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (["local", "sync"].includes(areaName)) {
                if (changes.bookmarkieDatabase) {
                    const dbStr = changes.bookmarkieDatabase.newValue;
                    displayItems(dbStr);
                }
            }
        });
    }

    useEffect(refreshItems, []);
    useEffect(registerOnStorageChanged, []);

    function rearrange(newOrderBookmarks: Bookmarked[], featuredBookmark: Bookmarked) {
        if (newOrderBookmarks.length === 0) return;

        // get the current order of ids
        const ids = [...newOrderBookmarks].map((e) => e.id);

        // featured won't be affected, it will be the first anyway
        const featuredId = featuredBookmark.id;

        storage.get(null, ({ bookmarkieDatabase }) => {
            // logic is as follows:
            // separate done, undone and featured from all
            // put in the order: featured, undone, done
            // where, undone elements will be ordered based on the current order of ids.

            const allBookmarks: Bookmarked[] = JSON.parse(bookmarkieDatabase).saved;

            const onlyUndone = allBookmarks.filter((x) => !x.done);
            const onlyDone = allBookmarks.filter((x) => x.done);

            const featuredItem = onlyUndone.find((x) => x.id === featuredId)!; // todo: bad
            const others = onlyUndone.filter((x) => x.id !== featuredId);

            const newBookmarks: Bookmarked[] = ids.map(
                (id) => others.find((x) => x.id === id)!,
            ); // todo: bad;

            const arr: Bookmarked[] = [featuredItem, ...newBookmarks, ...onlyDone];

            storage.set(makeDbObj(arr));
        });
    }

    const renderBodyItems = (featuredBookmark: Bookmarked, bookmarksCollection: Bookmarked[]) => (
        <ReactSortable
            list={bookmarksCollection}
            setList={setBookmarks}
            onEnd={() => {
                rearrange(bookmarksCollection, featuredBookmark!);
            }}
        >
            {bookmarksCollection.map((b) => (
                <BookmarkItem
                    {...b}
                    onDoneSuccess={refreshItems}
                    onDeleteSuccess={refreshItems}
                />
            ))}
        </ReactSortable>
    );

    const renderUndoneBookmarks = () => {
        if (noBookmarks || !featured) {
            return <NoBookmarks />;
        }
        return (
            <>
                <FeaturedBookmarkItem
                    {...featured!}
                    onDoneSuccess={refreshItems}
                    onDeleteSuccess={refreshItems}
                />
                <Collection>
                    {
                        bookmarks.length === 0
                            ? <NoBookmarks />
                            : renderBodyItems(featured!, bookmarks)
                    }
                </Collection>
            </>
        );
    };

    const renderDoneBookmarks = () => (hideDoneBookmarks ? null : (
        <Collection>
            {
                doneBookmarks.map((b) => (
                    <DoneBookmarkItem
                        {...b}
                        onUndoneSuccess={refreshItems}
                        onDeleteSuccess={refreshItems}
                    />
                ))
            }
        </Collection>
    ));

    const changeMode = () => {
        storage.get("darkMode", ({ darkMode }) => {
            let darkModeValue = false;
            if (darkMode !== undefined) {
                darkModeValue = !darkMode;
            }
            console.log(`set the value to ${darkModeValue}`);
            // props.setDarkMode(darkModeValue);
            storage.set({
                darkMode: darkModeValue,
            }, () => {
                window.location.reload();
            });
        });
    };

    const renderFloatingToolbar = () => {
        const style = { backgroundColor: "#e57b1e" };
        return (
            <Fab
                mainButtonStyles={style}
                icon={<i className="material-icons">help_outline</i>}
                alwaysShowTitle
            >
                <Action
                    style={style}
                    text={hideDoneBookmarks ? "Show done bookmarks" : "Hide done bookmarks"}
                    onClick={() => { setHideDoneBookmarks(!hideDoneBookmarks); }}
                >
                    <i className="material-icons">history</i>
                </Action>

                <Action
                    style={style}
                    text="Change mode"
                    onClick={() => { changeMode(); }}
                >
                    <i className="material-icons">history</i>
                </Action>
            </Fab>
        );
    };

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
