import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ token, setToken }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/login");
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                        Блог
                    </Link>
                </Typography>

                {token ? (
                    <>
                        <Button color="inherit" component={Link} to="/profile">
                            Профіль
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Вийти
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Логін
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Реєстрація
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;

