/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React from "react";
import { Card } from "react-materialize";
import { deleteBookmark, markAsDone } from "../ChromeInterations";

export default function FeaturedBookmarkItem(props: {
    id: string,
    title: string,
    url: string,
    description: string,
    onDoneSuccess: () => void,
    onDeleteSuccess: () => void,
}) {
    const {
        id, title, url, description, onDoneSuccess, onDeleteSuccess,
    } = props;
    return (
        <div>
            <div className="col s12 m6">
                <Card
                    actions={[
                        <a
                            href={url}
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
                                onClick={() => { markAsDone(id, onDoneSuccess); }}
                            >
                                Done
                            </a>
                            <a
                                href="#"
                                className="dark-orange-text"
                                key="featured-delete"
                                onClick={() => { deleteBookmark(id, onDeleteSuccess); }}
                            >
                                Delete
                            </a>
                        </span>,
                    ]}
                    className="featured-item"
                    textClassName="blue-text"
                    title={title}
                >
                    <p
                        className="card-description"
                        style={{
                            fontStyle: "italic",
                        }}
                    >
                        {description}
                    </p>
                </Card>
            </div>
        </div>
    );
}
