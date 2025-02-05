import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ImageGallery from "../components/ImageGallery";
import Comments from "../components/Comments";

const API_URL = "http://localhost:5000";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {

        axios
            .get(`${API_URL}/posts`)
            .then((res) => setPosts(res.data))
            .catch((err) => {
                setError(err.response?.data?.message || "Помилка при отриманні постів");
            });
    }, []);

    const handleLike = async (postId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Потрібно увійти, щоб лайкати!");
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/posts/${postId}/like`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setPosts((prev) =>
                prev.map((p) => (p.id === postId ? { ...p, likes: res.data.likes } : p))
            );
        } catch (err) {
            console.error("Помилка при лайку:", err);
            alert("Помилка при лайку. Можливо, токен прострочений. Залогіньтеся знову.");
        }
    };

    const updatePostComments = (postId, updatedComments) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId ? { ...p, comments: updatedComments } : p
            )
        );
    };

    return (
        <Container>
            <Typography
                variant="h3"
                sx={{ my: 3, textAlign: "center", color: "#4DD2D8" }}
            >
                Всі пости
            </Typography>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {}
            {posts.map((post) => (
                <Card
                    key={post.id}
                    sx={{
                        mb: 3,
                        backgroundColor: "#222",
                        border: "1px solid #4DD2D8",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: "bold",
                                mb: 2,
                                color: "#4DD2D8",
                            }}
                        >
                            {post.title}
                        </Typography>

                        {}
                        {post.images?.length > 0 && <ImageGallery images={post.images} />}

                        {}
                        <Typography
                            sx={{ mt: 2, color: "#ddd" }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {}
                        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                            <IconButton onClick={() => handleLike(post.id)} size="small">
                                <FavoriteIcon sx={{ color: "#4DD2D8" }} />
                            </IconButton>
                            <Typography sx={{ mr: 2, color: "#ddd" }}>
                                {post.likes || 0} ❤
                            </Typography>

                            {post.comments && (
                                <Typography sx={{ mr: 2, color: "#ddd" }}>
                                    Коментарів: {post.comments.length}
                                </Typography>
                            )}

                            <Typography
                                variant="body2"
                                sx={{ ml: "auto", fontStyle: "italic", color: "#4DD2D8" }}
                            >
                                Tag: {post.tag || "—"}
                            </Typography>
                        </Box>

                        {}
                        <Comments
                            postId={post.id}
                            comments={post.comments || []}
                            setComments={(updatedComments) =>
                                updatePostComments(post.id, updatedComments)
                            }
                        />
                    </CardContent>
                </Card>
            ))}

            {}
            {!posts.length && !error && (
                <Typography sx={{ mt: 2, color: "#ddd" }}>
                    Поки що немає постів.
                </Typography>
            )}
        </Container>
    );
};

export default Home;
