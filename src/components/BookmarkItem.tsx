/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css";
import React from "react";
import { CollectionItem } from "react-materialize";
import { deleteBookmark, markAsDone, markAsFeatured } from "../ChromeInterations";
import ActionBtn from "./ActionBtn";

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
                <ActionBtn
                    icon="bookmark"
                    title="Make Featured"
                    doOnClick={() => { markAsFeatured(id); }}
                />
                <ActionBtn
                    icon="done"
                    title="Done"
                    doOnClick={() => { markAsDone(id, onDoneSuccess); }}
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
