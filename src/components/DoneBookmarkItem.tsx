/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css";
import React from "react";
import { CollectionItem } from "react-materialize";
import { deleteBookmark, markAsUndone } from "../ChromeInterations";
import ActionBtn from "./ActionBtn";

export default function DoneBookmarkItem(props: {
    id: string,
    title: string,
    url: string,
    onUndoneSuccess: () => void,
    onDeleteSuccess: () => void,
}) {
    const {
        id, title, url, onUndoneSuccess, onDeleteSuccess,
    } = props;
    return (
        <CollectionItem
            className="customized"
            key={id}
            href=""
        >
            <a
                className="primary-content done-bookmark"
                title={title}
                href={url}
                target="_blank"
                rel="noreferrer"
            >
                {title}
            </a>
            <div className="other-content">
                <ActionBtn
                    icon="undo"
                    title="Undone"
                    doOnClick={() => { markAsUndone(id, onUndoneSuccess); }}
                />
                <ActionBtn
                    icon="delete"
                    title="Delete"
                    doOnClick={() => { deleteBookmark(id, onDeleteSuccess); }}
                />
            </div>
        </CollectionItem>
    );
}
