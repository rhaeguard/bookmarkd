/*global chrome, Sortable, M, makeDbObj, displayAllBookmarks, withStore, getShowHideElement, displayDoneBookmarks */
/* eslint-disable wrap-iife */

(function () {
    // display current undone bookmarks
    withStore((_, bookmarks) => {
        displayAllBookmarks(bookmarks);
    });
})();

(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var elems = document.querySelectorAll(".fixed-action-btn");
        M.FloatingActionButton.init(elems, {});
    });

    document.addEventListener("DOMContentLoaded", function () {
        var elems = document.querySelectorAll(".tooltipped");
        M.Tooltip.init(elems, {});
    });
})();

(function () {
    /* eslint-disable no-unused-vars */
    const _ = new Sortable(document.getElementById("items"), {
        animation: 150,
        onEnd: () => {
            let elements = document.getElementsByClassName("customized");

            const ids = [...elements].map((e) => e.getAttribute("bookmarkId"));

            const featuredId = document
                .getElementById("featured-item")
                .getAttribute("bookmarkId");

            const store = chrome.storage.sync;
            store.get(null, ({ bookmarkieDatabase }) => {
                const allBookmarks = JSON.parse(bookmarkieDatabase).saved;

                const onlyUndone = allBookmarks.filter((x) => !x.done);
                const onlyDone = allBookmarks.filter((x) => x.done);

                const featured = onlyUndone.find((x) => x.id === featuredId);
                const others = onlyUndone.filter((x) => x.id !== featured);

                const newBookmarks = ids.map((id) =>
                    others.find((x) => x.id === id)
                );

                store.set(makeDbObj([featured, ...newBookmarks, ...onlyDone]));
            });
        },
    });
    /* eslint-enable no-unused-vars */
})();

function registerShowHideButtonListener() {
    getShowHideElement().addEventListener("click", () => {
        const showDone = getShowHideElement().getAttribute("data-visibility") === "false";
        if (showDone) {
            displayDoneBookmarks();
        } else {
            document.getElementById("doneItems").className = "";
            document.getElementById("doneItems").innerHTML = "";
            getShowHideElement().setAttribute("data-visibility", "false");
        }
    });
}

function registerOnStorageUpdateListener() {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (["local", "sync"].includes(areaName)) {
            const dbStr = changes.bookmarkieDatabase.newValue;
            let items = [];
            if (dbStr) {
                items = JSON.parse(dbStr).saved;
            }
            displayAllBookmarks(items);
        }
    });
}

registerShowHideButtonListener();
registerOnStorageUpdateListener();