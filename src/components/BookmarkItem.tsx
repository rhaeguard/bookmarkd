/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css";
import React from "react";
import { CollectionItem } from "react-materialize";
import { deleteBookmark, markAsDone, markAsFeatured } from "../ChromeInterations";

function actionBtn(icon: string, doOnClick: () => void) {
    return (
        <i
            role="button"
            tabIndex={0}
            className="material-icons action-btn"
            onClick={doOnClick}
            onKeyDown={doOnClick}
        >
            {icon}
        </i>
    );
}

export default function BookmarkItem(props: {
    id: string,
    title: string,
    url: string,
    onDoneSuccess: () => void,
    onDeleteSuccess: () => void,
}) {
    const {
        id, title, url, onDoneSuccess, onDeleteSuccess,
    } = props;
    return (
        <CollectionItem
            className="customized"
            key={id}
            href=""
        >
            <a
                className="primary-content"
                title={title}
                href={url}
                target="_blank"
                rel="noreferrer"
            >
                {title}
            </a>
            <div className="other-content">
                {actionBtn("bookmark", () => { markAsFeatured(id); })}
                {actionBtn("done", () => { markAsDone(id, onDoneSuccess); })}
                {actionBtn("delete", () => { deleteBookmark(id, onDeleteSuccess); })}
            </div>
        </CollectionItem>
    );
}
