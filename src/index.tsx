/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-undef */
import React, { ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import BookmarkdApplication from "./BookmarkdApplication";

const LightTheme = React.lazy(() => import("./theme/LightTheme"));
const DarkTheme = React.lazy(() => import("./theme/DarkTheme"));

const [darkMode, setDarkMode] = useState(true);

const ThemeSelector = ({ children }: { children: ReactNode }) => (
    <>
        <React.Suspense fallback={<></>}>
            {darkMode && <DarkTheme />}
            {!darkMode && <LightTheme />}
        </React.Suspense>
        {children}
    </>
);

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (["local", "sync"].includes(areaName)) {
        if (changes.darkMode) {
            const darkModeValue = changes.darkMode.newValue === 1;
            setDarkMode(darkModeValue);
        }
    }
});

ReactDOM.render(
    <React.StrictMode>
        <ThemeSelector>
            <BookmarkdApplication />
        </ThemeSelector>
    </React.StrictMode>,
    document.getElementById("root"),
);
