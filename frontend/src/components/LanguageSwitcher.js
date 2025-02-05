import React, { useContext } from "react";
import { MenuItem, Select } from "@mui/material";
import SettingsContext from "../context/SettingsContext";

const LanguageSwitcher = () => {
    const { language, setLanguage } = useContext(SettingsContext);

    return (
        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <MenuItem value="en">🇬🇧 English</MenuItem>
            <MenuItem value="ua">🇺🇦 Українська</MenuItem>
        </Select>
    );
};

export default LanguageSwitcher;
