import React, { useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { Button, TextField, Typography, Box } from "@mui/material";

export default function Register({ onSwitch }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await createUserWithEmailAndPassword(
                auth,
                emailRef.current.value,
                passwordRef.current.value
            );
        } catch (err) {
            setError(err.message); // Mostrar el mensaje real de error de Firebase
        }
    };

    return (
        <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, margin: "auto", mt: 8 }}>
            <Typography variant="h5">Registro</Typography>
            <TextField label="Email" inputRef={emailRef} required />
            <TextField label="Contraseña" type="password" inputRef={passwordRef} required />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained">Registrarse</Button>
            <Button onClick={onSwitch}>¿Ya tienes cuenta? Inicia sesión</Button>
        </Box>
    );
} 