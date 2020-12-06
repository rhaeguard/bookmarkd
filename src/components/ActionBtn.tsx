import React from "react";

export default function ActionBtn(props: {
    icon: string;
    title: string;
    doOnClick: () => void
}) {
    const { doOnClick, icon, title } = props;
    return (
        <i
            role="button"
            tabIndex={0}
            className="material-icons action-btn"
            onClick={doOnClick}
            onKeyDown={doOnClick}
            title={title}
        >
            {icon}
        </i>
    );
}
