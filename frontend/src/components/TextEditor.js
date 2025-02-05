import React from "react";
import MDEditor from "@uiw/react-md-editor";

function TextEditor({ value, setValue }) {
    return (
        <div style={{ background: "#1e1e1e", padding: 10, borderRadius: 8 }}>
            <MDEditor value={value} onChange={setValue} height={200} />
        </div>
    );
}

export default TextEditor;
