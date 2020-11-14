import React from "react";
import { Card } from "react-materialize";
import { deleteBookmark, markAsDone } from "../ChromeInterations";

export function FeaturedBookmarkItem(props: {
    id: string,
    title: string,
    url: string,
    done: boolean,
    description: string,
    onDoneSuccess: () => void,
    onDeleteSuccess: () => void,
}) {
    return (
        <div>
            <div className="col s12 m6">
                <Card
                    actions={[
                        <a
                            href={props.url}
                            className="dark-orange-text"
                            key="featured-read-more"
                        >
                            Read more
                                </a>,
                        <span
                            className="action-buttons"
                            style={{
                                float: "right",
                            }}
                            key="featured-action-span"
                        >
                            <a
                                href="#"
                                className="dark-orange-text"
                                key="featured-done"
                                onClick={() => { markAsDone(props.id, props.onDoneSuccess) }}
                            >
                                Done
                                    </a>
                            <a
                                href="#"
                                className="dark-orange-text"
                                key="featured-delete"
                                onClick={() => { deleteBookmark(props.id, props.onDeleteSuccess) }}
                            >
                                Delete
                                    </a>
                        </span>,
                    ]}
                    className="featured-item"
                    textClassName="blue-text"
                    title={props.title}
                >
                    <p
                        className="card-description"
                        style={{
                            fontStyle: "italic",
                        }}
                    >
                        {props.description}
                    </p>
                </Card>
            </div>
        </div>
    )
}