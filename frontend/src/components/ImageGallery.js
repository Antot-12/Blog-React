import React from "react";
import { Box } from "@mui/material";

const ImageGallery = ({ images = [] }) => {
    if (!images.length) return null;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    alt={`upload-${i}`}
                    style={{
                        width: "100%",
                        maxWidth: 400,
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                    onClick={() => window.open(img, "_blank")}
                />
            ))}
        </Box>
    );
};

export default ImageGallery;
