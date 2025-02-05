import React, { useState } from "react";
import {
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
} from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000";

const Comments = ({ postId, comments = [], setComments }) => {
    const [newComment, setNewComment] = useState("");

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Спочатку увійдіть у систему, щоб додавати коментарі!");
            return;
        }

        try {
            const { data } = await axios.post(
                `${API_URL}/posts/${postId}/comments`,
                { comment: newComment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setComments(data.comments);
            setNewComment("");
        } catch (error) {
            console.error("Помилка додавання коментаря:", error.response?.data || error.message);
            alert("Не вдалося додати коментар. Можливо, токен прострочений.");
        }
    };

    return (
        <Box sx={{ mt: 3, p: 2, border: "1px solid #4DD2D8", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, color: "#4DD2D8" }}>
                Коментарі ({comments.length})
            </Typography>

            <List sx={{ mb: 2 }}>
                {comments.length > 0 ? (
                    comments.map((c, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                mb: 1,
                                backgroundColor: "#2a2a2a",
                                borderRadius: 1,
                                border: "1px solid #4DD2D8",
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ color: "#4DD2D8" }}>
                                        <strong>{c.author}</strong>{" "}
                                        <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                      ({new Date(c.date).toLocaleString()})
                    </span>
                                    </Box>
                                }
                                secondary={
                                    <Typography sx={{ color: "#c2f0f2" }}>
                                        {c.comment}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography sx={{ color: "#ddd" }}>Коментарів ще немає...</Typography>
                )}
            </List>

            <TextField
                fullWidth
                label="Написати коментар..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                        color: "#ddd",
                    },
                    "& .MuiInputLabel-root": {
                        color: "#4DD2D8",
                    },
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#4DD2D8",
                    },
                }}
            />
            <Button
                variant="contained"
                fullWidth
                onClick={handleAddComment}
                sx={{
                    backgroundColor: "#4DD2D8",
                    color: "#000",
                    "&:hover": {
                        backgroundColor: "#3ABFC2",
                    },
                }}
            >
                Додати коментар
            </Button>
        </Box>
    );
};

export default Comments;
