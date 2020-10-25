/*global setHtml, onClick, getShowHideElement, makeDbObj, withStore*/
/*exported displayCurrentUndoneBookmarks, displayAllBookmarks */

function displayFeaturedBookmark(bookmark) {
    const setHtml = (html) => {
        document.getElementById("featured").innerHTML = html;
    };

    if (bookmark) {
        const { id, title, description, url } = bookmark;
        let html = `
            <div class="col s12 m6">
                <div class="card" id="featured-item" bookmarkId="${id}">
                    <div class="card-content blue-text">
                        <a class="card-title blue-text" href="${url}">${title}</a>
                        <p>${description === null ? "" : description}</p>
                    </div>
                    <div class="card-action">
                        <a href="${url}" class="dark-orange-text">Read more</a>
                        <span style="float:right">
                            <a href="#" id="markDone" class="dark-orange-text">Done</a>
                            <a href="#" id="delete" class="dark-orange-text">Delete</a>
                        </div>
                    </div>
                </div>
            </div>`;
        setHtml(html);

        onClick("markDone", () => doneBookmark(id));
        onClick("delete", () => deleteBookmark(id));
    } else {
        setHtml("");
    }
}

function makeItem(title, url, id, isDone = false) {
    /* 
        <div class="collection">
            <div class="collection-item customized">
                <a href="#" class="primary-content">Title</a>
                <div class="other-content">
                    <i class="material-icons action-btn" bookmarkId="1"
                        >done</i
                    >
                    <i class="material-icons action-btn" bookmarkId="1"
                        >delete</i
                    >
                </div>
            </div>
        </div> 
    */
    const item = document.createElement("div");
    item.className = "collection-item customized";
    item.setAttribute("bookmarkId", id);

    // title and link
    const a = document.createElement("a");
    a.appendChild(document.createTextNode(title));
    a.title = title;
    a.href = url;
    a.className = "primary-content" + (isDone ? " done-bookmark" : ""); // done bookmarks are greyed out and italic
    a.target = "_blank";
    // title and link -- end

    // other content
    const oc = document.createElement("div");
    oc.className = "other-content";
    // other content -- end

    // buttons -- start
    const makeButton = (icon, callback) => {
        const btn = document.createElement("i");
        btn.appendChild(document.createTextNode(icon));
        btn.className = "material-icons action-btn";
        btn.setAttribute("bookmarkId", id);
        btn.addEventListener("click", callback);
        return btn;
    };

    if (isDone) {
        // done bookmark only has undone option
        oc.appendChild(makeButton("undo", () => undoneBookmark(id)));
    } else {
        // undone bookmark has done and make featured options
        oc.appendChild(makeButton("bookmark", () => makeBookmarkFeatured(id)));
        oc.appendChild(makeButton("done", () => doneBookmark(id)));
    }
    // deleting is common for both done and undone
    oc.appendChild(makeButton("delete", () => deleteBookmark(id)));
    // buttons -- end

    item.appendChild(a);
    item.appendChild(oc);

    return item;
}

function displayBookmarks(items, divId = "items", isDone = false) {
    const collection = document.getElementById(divId);
    collection.innerHTML = "";
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
