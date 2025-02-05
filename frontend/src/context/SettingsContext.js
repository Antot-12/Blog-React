import React, { createContext, useState, useEffect } from "react";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("en");

    useEffect(() => {

        localStorage.setItem("theme", theme);
        localStorage.setItem("language", language);
    }, [theme, language]);

    return (
        <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
