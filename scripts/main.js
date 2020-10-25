/*global makeElement, makeAnchor, getShowHideElement, makeDbObj, withStore*/
/*exported displayCurrentUndoneBookmarks, displayAllBookmarks */

function createFeaturedElement(id, title, description, url) {
    const actionBtn = (text, btnId, callback) => {
        const btn = makeAnchor("dark-orange-text", text, "#", btnId);
        btn.addEventListener("click", () => callback(id));
        return btn;
    };

    return makeElement("div", "col s12 m6", {}, [
        makeElement(
            "div",
            "card",
            {
                bookmarkId: id,
                id: "featured-item",
            },
            [
                makeElement("div", "card-content blue-text", {}, [
                    makeAnchor("card-title blue-text", title, url),
                    makeElement(
                        "p",
                        "card-description",
                        {
                            style: "font-style:italic",
                        },
                        [
                            document.createTextNode(
                                description === null ? "" : description
                            ),
                        ]
                    ),
                ]),
                makeElement("div", "card-action", {}, [
                    makeAnchor("dark-orange-text", "Read more", url),
                    makeElement(
                        "span",
                        "action-buttons",
                        {
                            style: "float:right",
                        },
                        [
                            actionBtn("Done", "markDone", doneBookmark),
                            actionBtn("Delete", "delete", deleteBookmark),
                        ]
                    ),
                ]),
            ]
        ),
    ]);
}

const clearDiv = (divToClear) => {
    const div = divToClear;
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
};

function displayFeaturedBookmark(bookmark) {
    const featuredDiv = () => document.getElementById("featured");

    if (bookmark) {
        const { id, title, description, url } = bookmark;

        const featured = createFeaturedElement(id, title, description, url);

        clearDiv(featuredDiv());
        featuredDiv().appendChild(featured);
    } else {
        clearDiv(featuredDiv());
    }
}

function displayBookmarks(items, divId = "items", isDone = false) {
    const collection = document.getElementById(divId);
    clearDiv(collection);
    if (items.length > 0) {
        items.forEach(({ id, title, url }) => {
            collection.append(makeItem(title, url, id, isDone));
        });
    } else {
        const noBookmarks = document.createElement("p");
        noBookmarks.appendChild(document.createTextNode("no bookmarks"));
        noBookmarks.className = "center";
        collection.append(noBookmarks);
    }
}

function displayAllBookmarks(items) {
    if (items) {
        const filtered = items.filter((b) => b != null).filter((b) => !b.done);
        const [first, ...others] = filtered;
        displayFeaturedBookmark(first);
        if (others.length >= 0) {
            displayBookmarks(others);
        }
    }
}

function doneBookmark(id) {
    const updatDoneBookmarksIfVisible = () => {
        const showDone =
            getShowHideElement().getAttribute("data-visibility") === "true";
        if (showDone) {
            displayDoneBookmarks();
        }
    };

    withStore((store, bookmarks) => {
        for (let b of bookmarks) {
            if (b.id === id) {
                b.done = true;
            }
        }
        store.set(makeDbObj(bookmarks), () => {
            updatDoneBookmarksIfVisible();
        });
    });
}

function displayDoneBookmarks() {
    withStore((_, bookmarks) => {
        const onlyDone = bookmarks.filter((x) => x.done);
        displayBookmarks(onlyDone, "doneItems", true);
        document.getElementById("doneItems").className = "collection";
        getShowHideElement().setAttribute("data-visibility", "true");
    });
}

function undoneBookmark(id) {
    withStore((store, bookmarks) => {
        for (let b of bookmarks) {
            if (b.id === id) {
                b.done = false;
            }
        }
        const undoneBookmark = bookmarks.find((x) => x.id === id);
        const withoutUndone = bookmarks.filter((x) => x.id !== id);
        store.set(makeDbObj([...withoutUndone, undoneBookmark]), () => {
            displayDoneBookmarks();
        });
    });
}

function deleteBookmark(id) {
    withStore((store, bookmarks) => {
        store.set(makeDbObj(bookmarks.filter((x) => x.id !== id)));
    });
}

function makeBookmarkFeatured(id) {
    withStore((store, bookmarks) => {
        const b = bookmarks.find((x) => x.id === id && !x.done);
        const newBookmarks = bookmarks.filter((x) => x.id !== id);
        store.set(makeDbObj([b, ...newBookmarks]));
    });
}

function makeItem(title, url, id, isDone = false) {
    const makeButton = (icon, callback) => {
        const btn = makeElement(
            "i",
            "material-icons action-btn",
            {
                bookmarkId: id,
            },
            [document.createTextNode(icon)]
        );

        btn.addEventListener("click", callback);
        return btn;
    };

    // deleting is common for both done and undone
    let buttons = [makeButton("delete", () => deleteBookmark(id))];
    
    if (isDone) {
        // done bookmark only has undone option
        buttons = [makeButton("undo", () => undoneBookmark(id)), ...buttons];
    } else {
        // undone bookmark has done and make featured options
        buttons = [
            makeButton("bookmark", () => makeBookmarkFeatured(id)),
            makeButton("done", () => doneBookmark(id)),
            ...buttons,
        ];
    }

    // buttons -- end

    return makeElement(
        "div",
        "collection-item customized",
        {
            bookmarkId: id,
        },
        [
            makeElement(
                "a",
                "primary-content" + (isDone ? " done-bookmark" : ""), // done bookmarks are greyed out and italic
                {
                    title: title,
                    href: url,
                    target: "_blank",
                },
                [document.createTextNode(title)]
            ),
            makeElement("div", "other-content", {}, buttons),
        ]
    );
}

/**

{
   "bookmarkieDatabase":{
      "saved":[
         {
            "id":"665674096476",
            "title":"Docker for Beginners: Full Free Course! - YouTube",
            "url":"https://www.youtube.com/watch?v=zJ6WbK9zFpI&ab_channel=KodeKloud",
            "done":false
         },
         {
            "id":"940543425474",
            "title":"Spring Boot: Up and Running [Book]",
            "url":"https://www.oreilly.com/library/view/spring-boot-up/9781492076971",
            "done":false
         }
      ]
   }
}
 */
