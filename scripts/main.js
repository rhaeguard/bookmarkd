chrome.storage.sync.get(["bookmarkieDatabase"], ({ bookmarkieDatabase }) => {
    if (bookmarkieDatabase) {
        const db = JSON.parse(bookmarkieDatabase);
        const saved = db.saved;
        doDisplayAllItems(saved);
    }
});

function doDisplayAllItems(items) {
    if (items) {
        const filtered = items.filter((b) => !b.done);
        const [first, ...others] = filtered;
        displayFeatured(first);
        if (others.length >= 0) {
            displayItems(others);
        }
    }
}

function displayFeatured(bookmark) {
    if (bookmark) {
        const { id, title, description, url, image } = bookmark;
        let html = `
            <div class="col s12 m6">
                <div class="card featured-item">
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
        setHtml("featured", html);

        onClick("markDone", () => doneBookmark(id));
        onClick("delete", () => deleteBookmark(id));
    } else {
        setHtml("featured", "");
    }
}

function onClick(id, callback) {
    document.getElementById(id).addEventListener("click", (_) => callback());
}

function setHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (["local", "sync"].includes(areaName)) {
        const dbStr = changes.bookmarkieDatabase.newValue;
        if (dbStr) {
            const db = JSON.parse(dbStr);
            doDisplayAllItems(db.saved);
        } else {
            doDisplayAllItems([]);
        }
    }
});

function displayItems(items) {
    const collection = document.getElementById("items");
    collection.innerHTML = "";
    if (items.length > 0) {
        items.forEach(({ id, title, url }) => {
            collection.append(makeItem(title, url, id));
        });
    } else {
        const noBookmarks = document.createElement("p");
        noBookmarks.appendChild(document.createTextNode("no bookmarks"));
        noBookmarks.className = "center";
        collection.append(noBookmarks);
    }
}

function makeItem(title, url, id) {
    /* <div class="collection">
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
        </div> */
    const item = document.createElement("div");
    item.className = "collection-item customized";

    // title and link
    const a = document.createElement("a");
    a.appendChild(document.createTextNode(title));
    a.title = title;
    a.href = url;
    a.className = "primary-content";
    a.target = "_blank";
    // title and link -- end

    // other content
    const oc = document.createElement("div");
    oc.className = "other-content";
    // other content -- end

    // makeFeatured button
    const makeFeatured = document.createElement("i");
    makeFeatured.appendChild(document.createTextNode("bookmark"));
    makeFeatured.className = "material-icons action-btn";
    makeFeatured.setAttribute("bookmarkId", id);
    makeFeatured.addEventListener("click", (_) => doMakeFeatued(id));
    // done button -- end

    // buttons
    // done button
    const done = document.createElement("i");
    done.appendChild(document.createTextNode("done"));
    done.className = "material-icons action-btn";
    done.setAttribute("bookmarkId", id);
    done.addEventListener("click", (_) => doneBookmark(id));
    // done button -- end

    // delete button
    const deleteBtn = document.createElement("i");
    deleteBtn.appendChild(document.createTextNode("delete"));
    deleteBtn.className = "material-icons action-btn";
    deleteBtn.setAttribute("bookmarkId", id);
    deleteBtn.addEventListener("click", (_) => deleteBookmark(id));
    // delete button -- end

    oc.appendChild(makeFeatured)
    oc.appendChild(done);
    oc.appendChild(deleteBtn);

    item.appendChild(a);
    item.appendChild(oc);

    return item;
}

function makeDbObj(obj) {
    return {
        bookmarkieDatabase: JSON.stringify({
            saved: obj,
        }),
    };
}

function doneBookmark(id) {
    const store = chrome.storage.sync;
    store.get(null, ({ bookmarkieDatabase }) => {
        const bookmarks = JSON.parse(bookmarkieDatabase).saved;
        for (let b of bookmarks) {
            if (b.id === id) {
                b.done = true;
            }
        }

        store.set(makeDbObj(bookmarks));
    });
}

function deleteBookmark(id) {
    const store = chrome.storage.sync;
    store.get(null, ({ bookmarkieDatabase }) => {
        const bookmarks = JSON.parse(bookmarkieDatabase).saved;
        store.set(makeDbObj(bookmarks.filter((x) => x.id !== id)));
    });
}

function doMakeFeatued(id) {
    const store = chrome.storage.sync;
    store.get(null, ({ bookmarkieDatabase }) => {
        const oldBookmarks = JSON.parse(bookmarkieDatabase).saved;
        const b = oldBookmarks.find((x) => x.id === id && !x.done);
        const newBookmarks = oldBookmarks.filter((x) => x.id !== id);
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
