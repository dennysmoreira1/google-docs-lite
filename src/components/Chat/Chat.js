import React, { useEffect, useRef, useState } from "react";
import { db, auth } from "../../firebase/config";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { Box, TextField, Button, List, ListItem, ListItemText, Typography } from "@mui/material";

export default function Chat({ docId }) {
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState("");
    const bottomRef = useRef();

    useEffect(() => {
        const q = query(
            collection(db, "documents", docId, "chat"),
            orderBy("created")
        );
        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map(doc => doc.data()));
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });
        return unsub;
    }, [docId]);

    const sendMsg = async (e) => {
        e.preventDefault();
        if (!msg.trim()) return;
        await addDoc(collection(db, "documents", docId, "chat"), {
            text: msg,
            user: auth.currentUser.email,
            created: serverTimestamp()
        });
        setMsg("");
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Chat</Typography>
            <List sx={{ maxHeight: 200, overflow: "auto", bgcolor: "#f5f5f5", mb: 1 }}>
                {messages.map((m, i) => (
                    <ListItem key={i}>
                        <ListItemText primary={m.text} secondary={m.user} />
                    </ListItem>
                ))}
                <div ref={bottomRef} />
            </List>
            <Box component="form" onSubmit={sendMsg} sx={{ display: "flex", gap: 1 }}>
                <TextField
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    size="small"
                    fullWidth
                    placeholder="Escribe un mensaje..."
                />
                <Button type="submit" variant="contained">Enviar</Button>
            </Box>
        </Box>
    );
} 