import React from "react";
import { Select, MenuItem } from "@mui/material";

const availableTags = ["Tech", "Travel", "Art", "Photography", "Coding"];

function TagsFilter({ selectedTag, setSelectedTag }) {
    return (
        <Select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            fullWidth
            displayEmpty
        >
            <MenuItem value="">(Без тегу)</MenuItem>
            {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                    {tag}
                </MenuItem>
            ))}
        </Select>
    );
}

export default TagsFilter;
