/* exported getMetaInfo */
const parser = new DOMParser();

function retrieveMetaFromHtmlText(htmlText) {
    const defaultIfNull = (obj) => (obj ? obj.content : null);

    const dom = parser.parseFromString(htmlText, "text/html");

    /* eslint-disable quotes */
    const description = defaultIfNull(
        dom.querySelector(`meta[property="og:description"]`)
    );
    const image = defaultIfNull(dom.querySelector(`meta[property="og:image"]`));
    /* eslint-enable quotes */

    return {
        description,
        image,
    };
}

function getMetaInfo(url, callback) {
    fetch(url)
        .then((res) => res.text())
        .then(retrieveMetaFromHtmlText)
        .then((info) => callback(info))
        .catch((reason) => console.log(reason)); /* eslint-disable-line no-console */
}
