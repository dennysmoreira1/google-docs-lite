import React, { useState, createContext, useMemo, useContext } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import { ThemeProvider, createTheme, CssBaseline, IconButton, Box } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from "@mui/material/styles";

const ColorModeContext = createContext({ toggleColorMode: () => { } });

function AuthGate() {
    const { currentUser } = useAuth();
    const [showRegister, setShowRegister] = useState(false);

    if (!currentUser) {
        return showRegister
            ? <Register onSwitch={() => setShowRegister(false)} />
            : <Login onSwitch={() => setShowRegister(true)} />;
    }
    return <Dashboard />;
}

function ThemeToggle() {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();
    return (
        <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 2000 }}>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Box>
    );
}

export default function App() {
    const [mode, setMode] = useState('light');
    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
    }), []);

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode,
                primary: {
                    main: mode === 'light' ? '#1976d2' : '#90caf9',
                },
                background: {
                    default: mode === 'light' ? '#f4f6fa' : '#121212',
                    paper: mode === 'light' ? '#fff' : '#1e1e1e',
                },
            },
            shape: {
                borderRadius: 12,
            },
            typography: {
                fontFamily: 'Roboto, Arial, sans-serif',
            },
        }), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ThemeToggle />
                <AuthProvider>
                    <AuthGate />
                </AuthProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
} 