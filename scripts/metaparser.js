// parser part
const parser = new DOMParser();

function getMetaInfo(url, callback) {
    fetch(url)
        .then((res) => res.text())
        .then(retrieveMetaFromHtmlText)
        .then((info) => callback(info))
        .catch((reason) => console.log(reason));
}

function retrieveMetaFromHtmlText(htmlText) {
    const defaultIfNull = (obj) => {
        if (obj) {
            return obj.content;
        }
        return null;
    }

    const dom = parser.parseFromString(htmlText, "text/html");

    const description = defaultIfNull(
        dom.querySelector(`meta[property="og:description"]`)
    );
    const image = defaultIfNull(
        dom.querySelector(`meta[property="og:image"]`)
    );

    return {
        description,
        image,
    };
}

