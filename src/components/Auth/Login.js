import React, { useRef, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Button, TextField, Typography, Box } from "@mui/material";

export default function Login({ onSwitch }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(
                auth,
                emailRef.current.value,
                passwordRef.current.value
            );
        } catch (err) {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, margin: "auto", mt: 8 }}>
            <Typography variant="h5">Iniciar Sesión</Typography>
            <TextField label="Email" inputRef={emailRef} required />
            <TextField label="Contraseña" type="password" inputRef={passwordRef} required />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained">Entrar</Button>
            <Button onClick={onSwitch}>¿No tienes cuenta? Regístrate</Button>
        </Box>
    );
} 