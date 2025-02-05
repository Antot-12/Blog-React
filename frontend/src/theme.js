import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
    createTheme({
        palette: {
            mode: mode,
            primary: { main: "#00e5ff" },
            background: {
                default: mode === "dark" ? "#121212" : "#ffffff",
                paper: mode === "dark" ? "#1e1e1e" : "#f5f5f5"
            },
            text: {
                primary: mode === "dark" ? "#ffffff" : "#000000"
            }
        }
    });

export default getTheme;
