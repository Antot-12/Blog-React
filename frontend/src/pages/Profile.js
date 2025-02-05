import React, { useEffect, useState } from "react";
import axios from "axios";

import { jwtDecode } from "jwt-decode";


import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const API_URL = "http://localhost:5000";

const Profile = ({ token }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);


    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState("user");


    const englishIdeas = [
        {
            title: "10 Ways to Stay Motivated as a Developer",
            content:
                "Developers often struggle to stay motivated. In this post, we'll explore ten proven strategies to keep your coding spark alive...",
        },
        {
            title: "Understanding Web3 and Decentralized Apps",
            content:
                "Curious about how Web3 changes the internet? Let's examine the core concepts of decentralization, blockchain technology, and dApps...",
        },
        {
            title: "Top 5 JavaScript Tricks for Cleaner Code",
            content:
                "Modern JS offers many features. We'll explore arrow functions, destructuring, optional chaining, and more to help you write cleaner JS...",
        },
        {
            title: "Mastering React Performance",
            content:
                "Performance can make or break a React app. We'll discuss memoization, lazy-loading, and other best practices to optimize rendering...",
        },
        {
            title: "How to Survive a Coding Bootcamp",
            content:
                "Bootcamps are intense, but they can launch your career. We'll talk about preparation, networking, and time management tips...",
        },
        {
            title: "Building Full-Stack Apps with Node.js",
            content:
                "Node.js is an excellent choice for creating end-to-end JavaScript solutions. Here’s how to set up your project, connect to a database, and more...",
        },
        {
            title: "Remote Work: Balancing Productivity and Flexibility",
            content:
                "Working remotely has its perks but also challenges. Learn how to structure your day, avoid burnout, and stay connected with your team...",
        },
        {
            title: "AI Trends That Will Shape the Future",
            content:
                "Artificial intelligence evolves rapidly. We’ll explore current trends in machine learning, natural language processing, and how they impact the tech landscape...",
        },
    ];


    const [prefilledPost, setPrefilledPost] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
            setUserRole(decoded.role);
        } catch (err) {
            console.error("Помилка декодування токена:", err);
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        if (!userId) return;
        axios
            .get(`${API_URL}/posts`)
            .then((res) => {
                const userPosts =
                    userRole === "admin"
                        ? res.data
                        : res.data.filter((p) => p.userId === userId);
                setPosts(userPosts);
            })
            .catch((err) => {
                console.error("❌ Помилка отримання постів:", err);
            });
    }, [userId, userRole]);


    const handleGenerateIdea = () => {
        const randIndex = Math.floor(Math.random() * englishIdeas.length);
        const idea = englishIdeas[randIndex];

        setPrefilledPost(idea);
    };

    return (
        <Box sx={{ color: "#ddd" }}>
            <Typography variant="h4" sx={{ mb: 2, color: "#4DD2D8" }}>
                Мій Профіль
            </Typography>

            { }
            <Button
                variant="outlined"
                sx={{
                    mb: 2,
                    color: "#4DD2D8",
                    borderColor: "#4DD2D8",
                    "&:hover": {
                        borderColor: "#3ABFC2",
                        color: "#3ABFC2",
                    },
                }}
                onClick={handleGenerateIdea}
            >
                Generate English Post Idea
            </Button>

            { }
            <PostForm
                editingPost={editingPost}
                setEditingPost={setEditingPost}
                setPosts={setPosts}
                prefilledPost={prefilledPost}
            />

            {/* Перелік постів */}
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    token={token}
                    userId={userId}
                    userRole={userRole}
                    setPosts={setPosts}
                    setEditingPost={setEditingPost}
                />
            ))}

            {!posts.length && (
                <Typography sx={{ mt: 2 }}>
                    У вас ще немає постів або виникла помилка.
                </Typography>
            )}
        </Box>
    );
};

export default Profile;
