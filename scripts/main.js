chrome.storage.sync.get(["bookmarkieDatabase"], ({ bookmarkieDatabase }) => {
    if (bookmarkieDatabase) {
        const db = JSON.parse(bookmarkieDatabase);
        displayItems(db.saved);
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (["local", "sync"].includes(areaName)) {
        const dbStr = changes.bookmarkieDatabase.newValue;
        if (dbStr) {
            const db = JSON.parse(dbStr);
            displayItems(db.saved);
        } else {
            displayItems([]);
        }
    }
});

function displayItems(items) {
    const collection = document.getElementById("items");
    collection.innerHTML = "";
    const filtered = items.filter((b) => !b.done);
    if (filtered.length > 0) {
        filtered.forEach(({ id, title, url }) => {
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

    // buttons
    // done button
    const done = document.createElement("i");
    done.appendChild(document.createTextNode("done"));
    done.className = "material-icons action-btn";
    done.setAttribute("bookmarkId", id);
    done.addEventListener("click", (_) => {
        // TODO
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
    });
    // done button -- end

    // delete button
    const deleteBtn = document.createElement("i");
    deleteBtn.appendChild(document.createTextNode("delete"));
    deleteBtn.className = "material-icons action-btn";
    deleteBtn.setAttribute("bookmarkId", id);
    deleteBtn.addEventListener("click", (_) => {
        // TODO
        const store = chrome.storage.sync;
        store.get(null, ({ bookmarkieDatabase }) => {
            const bookmarks = JSON.parse(bookmarkieDatabase).saved;
            store.set(makeDbObj(bookmarks.filter((x) => x.id !== id)));
        });
    });
    // delete button -- end

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
