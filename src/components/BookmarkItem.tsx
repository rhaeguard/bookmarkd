import "materialize-css/dist/css/materialize.min.css";
import "materialize-css";
import React from 'react'
import { CollectionItem } from "react-materialize";
import { deleteBookmark, markAsDone, markAsFeatured } from "../ChromeInterations";

export default function BookmarkItem(props: {
    id: string,
    title: string,
    url: string,
    done: boolean,
    description: string,
    onDoneSuccess: () => void,
    onDeleteSuccess: () => void,
}) {
    return (
        <CollectionItem className="customized" key={props.id} href={""}>
            <a
                className="primary-content"
                title={props.title}
                href={props.url}
                target="_blank"
            >
                {props.title}
            </a>
            <div className="other-content">
                {actionBtn("bookmark", () => { markAsFeatured(props.id) })}
                {actionBtn("done", () => { markAsDone(props.id, props.onDoneSuccess) })}
                {actionBtn("delete", () => { deleteBookmark(props.id, props.onDeleteSuccess) })}
            </div>
        </CollectionItem>
    )
}

function actionBtn(icon: string, doOnClick: () => void) {
    return (
        <i className="material-icons action-btn" onClick={doOnClick}>
            {icon}
        </i>
    )
}