import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, TextField, Box } from "@mui/material";
import axios from "axios";

const API_URL = "http://localhost:5000";

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get(`${API_URL}/posts`).then(res => setPosts(res.data));
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container>
            <Typography variant="h3" sx={{ my: 3, textAlign: "center" }}>Всі пости</Typography>
            <TextField
                fullWidth
                label="Пошук постів"
                variant="outlined"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                sx={{ mb: 3 }}
            />
            {filteredPosts.map(post => (
                <Card key={post.id} sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5">{post.title}</Typography>
                        <Typography>{post.content}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default AllPosts;
