import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Button } from "@mui/material";
import TagsFilter from "./TagsFilter";
import TextEditor from "./TextEditor";

const API_URL = "http://localhost:5000";

const PostForm = ({ editingPost, setEditingPost, setPosts, prefilledPost }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [files, setFiles] = useState([]);


    useEffect(() => {
        if (editingPost) {
            setTitle(editingPost.title);
            setContent(editingPost.content);
            setSelectedTag(editingPost.tag || "");
            setFiles([]);
        } else {
            setTitle("");
            setContent("");
            setSelectedTag("");
            setFiles([]);
        }
    }, [editingPost]);


    useEffect(() => {
        if (!editingPost && prefilledPost) {
            setTitle(prefilledPost.title || "");
            setContent(prefilledPost.content || "");
        }
    }, [prefilledPost, editingPost]);

    const handleCreateOrUpdatePost = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Потрібно увійти, щоб створювати/редагувати пости!");
            return;
        }

        try {
            if (editingPost) {

                await axios.put(
                    `${API_URL}/posts/${editingPost.id}`,
                    { title, content, tag: selectedTag },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === editingPost.id
                            ? { ...p, title, content, tag: selectedTag }
                            : p
                    )
                );
                setEditingPost(null);
            } else {

                const formData = new FormData();
                formData.append("title", title);
                formData.append("content", content);
                formData.append("tag", selectedTag);
                files.forEach((file) => formData.append("files", file));

                const { data } = await axios.post(`${API_URL}/posts`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                setPosts((prev) => [data, ...prev]);
            }

            setTitle("");
            setContent("");
            setSelectedTag("");
            setFiles([]);
        } catch (err) {
            console.error("Помилка при створенні/редагуванні поста:", err);
            alert("Помилка при створенні/редагуванні. Можливо, токен прострочений.");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleCreateOrUpdatePost}
            sx={{
                mb: 3,
                p: 2,
                border: "1px solid #4DD2D8",
                borderRadius: 2,
                backgroundColor: "#2a2a2a",
            }}
        >
            <TextField
                fullWidth
                label="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                sx={{
                    mb: 2,
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

            {}
            <TextEditor value={content} setValue={setContent} />

            {/* Вибір тегу */}
            <Box sx={{ mt: 2, mb: 2 }}>
                <TagsFilter selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
            </Box>

            {}
            {!editingPost && (
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => setFiles([...e.target.files])}
                    style={{ marginBottom: "1rem", color: "#ddd" }}
                />
            )}

            <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: "#4DD2D8",
                    color: "#000",
                    "&:hover": {
                        backgroundColor: "#3ABFC2",
                    },
                }}
            >
                {editingPost ? "Оновити пост" : "Створити пост"}
            </Button>
        </Box>
    );
};

export default PostForm;
