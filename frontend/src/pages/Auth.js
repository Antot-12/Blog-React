import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Auth = ({ isLogin, setToken }) => {
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const endpoint = isLogin ? "/login" : "/register";
            const { data } = await axios.post(`${API_URL}${endpoint}`, form, {
                headers: { "Content-Type": "application/json" },
            });

            if (data.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                navigate("/profile");
            } else {
                setError("Не отримано токен авторизації.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Помилка при авторизації");
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                {isLogin ? "Логін" : "Реєстрація"}
            </Typography>
            {error && <Typography color="error">{error}</Typography>}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Логін"
                    fullWidth
                    margin="normal"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <TextField
                    label="Пароль"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    {isLogin ? "Увійти" : "Зареєструватися"}
                </Button>
            </form>
        </Box>
    );
};

export default Auth;
