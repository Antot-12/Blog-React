import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const theme = createTheme({
        palette: {
            mode: "dark",
            primary: { main: "#0ff" },
            background: {
                default: "#101010",
                paper: "#181818",
            },
        },
        typography: {

            fontFamily: "'Roboto', sans-serif",
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Navbar token={token} setToken={setToken} />
                <Container sx={{ mt: 4 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/login"
                            element={<Auth isLogin={true} setToken={setToken} />}
                        />
                        <Route
                            path="/register"
                            element={<Auth isLogin={false} setToken={setToken} />}
                        />
                        <Route
                            path="/profile"
                            element={<Profile token={token} />}
                        />
                    </Routes>
                </Container>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
