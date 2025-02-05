import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import ImageGallery from "./ImageGallery";
import Comments from "./Comments";

const API_URL = "http://localhost:5000";

function PostCard({ post, token, userId, userRole, setPosts, setEditingPost }) {

    const [comments, setComments] = useState(post.comments || []);

    const handleDelete = async () => {
        if (!token) {
            alert("Потрібно увійти!");
            return;
        }
        try {
            await axios.delete(`${API_URL}/posts/${post.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts((prev) => prev.filter((p) => p.id !== post.id));
        } catch (err) {
            console.error("Помилка при видаленні поста:", err);
            alert("Не вдалося видалити пост");
        }
    };

    const handleLike = async () => {
        if (!token) {
            alert("Потрібно увійти, щоб лайкати!");
            return;
        }
        try {
            const res = await axios.post(
                `${API_URL}/posts/${post.id}/like`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setPosts((prev) =>
                prev.map((p) =>
                    p.id === post.id ? { ...p, likes: res.data.likes } : p
                )
            );
        } catch (err) {
            console.error("Помилка при лайку:", err);
            alert("Не вдалося поставити лайк");
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {post.title}
                </Typography>

                {}
                {post.images && <ImageGallery images={post.images} />}

                {}
                <Typography
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    sx={{ mt: 2 }}
                />

                <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                    Tag: {post.tag || "—"}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 1 }}>
                    <IconButton size="small" onClick={handleLike}>
                        <FavoriteIcon />
                    </IconButton>
                    <Typography>{post.likes || 0} ❤</Typography>

                    {}
                    {(post.userId === userId || userRole === "admin") && (
                        <>
                            <IconButton size="small" onClick={() => setEditingPost(post)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="small" onClick={handleDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )}
                </Box>

                {}
                <Comments
                    postId={post.id}
                    comments={comments}
                    setComments={(updatedComments) => {

                        setComments(updatedComments);

                        setPosts((prevPosts) =>
                            prevPosts.map((p) =>
                                p.id === post.id ? { ...p, comments: updatedComments } : p
                            )
                        );
                    }}
                />
            </CardContent>
        </Card>
    );
}

export default PostCard;
