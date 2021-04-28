/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import BookmarkdApplication from "./BookmarkdApplication";

const LightTheme = React.lazy(() => import("./theme/LightTheme"));
const DarkTheme = React.lazy(() => import("./theme/DarkTheme"));

const ThemeSelector = () => {
    const [darkModeState, setDarkMode] = useState(false);

    useEffect(() => {
        chrome.storage.local.get("darkMode", ({ darkMode }) => {
            setDarkMode(darkMode !== undefined ? darkMode : false);
        });
    }, []);

    function listener(changes: any, areaName: any) {
        let value;
        if (["local", "sync"].includes(areaName)) {
            console.log("from use effect");
            console.log(changes);
            if (changes.darkMode) {
                const darkModeValue = changes.darkMode.newValue;
                console.log(`dark mode set from ${darkModeState} to ${darkModeValue}`);
                value = darkModeState;
            } else {
                value = !darkModeState;
            }
        } else {
            value = !darkModeState;
        }
        setDarkMode(value);
    }

    useEffect(() => {
        chrome.storage.onChanged.addListener(listener);
        return () => {
            chrome.storage.onChanged.removeListener(listener);
        };
    }, [listener]);

    return (
        <>
            <React.Suspense fallback={<></>}>
                {darkModeState && <DarkTheme />}
                {!darkModeState && <LightTheme />}
            </React.Suspense>
            <BookmarkdApplication />
        </>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <ThemeSelector />
    </React.StrictMode>,
    document.getElementById("root"),
);
