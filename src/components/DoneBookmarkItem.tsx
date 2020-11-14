import "materialize-css/dist/css/materialize.min.css";
import "materialize-css";
import React from 'react'
import { CollectionItem } from "react-materialize";
import { deleteBookmark, markAsUndone } from "../ChromeInterations";

export default function DoneBookmarkItem(props: {
    id: string,
    title: string,
    url: string,
    done: boolean,
    description: string,
    onUndoneSuccess: () => void,
    onDeleteSuccess: () => void,
}) {
    return (
        <CollectionItem className="customized" key={props.id} href={""}>
            <a
                className="primary-content done-bookmark"
                title={props.title}
                href={props.url}
                target="_blank"
            >
                {props.title}
            </a>
            <div className="other-content">
                {actionBtn("undo", () => { markAsUndone(props.id, props.onUndoneSuccess) })}
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