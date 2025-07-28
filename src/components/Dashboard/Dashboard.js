import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase/config";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Button, TextField, Typography, Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Logout, Delete, Edit } from "@mui/icons-material";
import Editor from "../Editor/Editor";

export default function Dashboard() {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [editingName, setEditingName] = useState(null);
    const [newName, setNewName] = useState("");
    const nameRef = useRef();

    useEffect(() => {
        const q = query(collection(db, "documents"), where("owner", "==", auth.currentUser.uid));
        const unsub = onSnapshot(q, (snapshot) => {
            setDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return unsub;
    }, []);

    const createDoc = async () => {
        if (!nameRef.current.value) return;
        await addDoc(collection(db, "documents"), {
            name: nameRef.current.value,
            owner: auth.currentUser.uid,
            created: Date.now(),
            content: ""
        });
        nameRef.current.value = "";
    };

    const deleteDocument = async (id) => {
        await deleteDoc(doc(db, "documents", id));
        if (selectedDoc === id) setSelectedDoc(null);
    };

    const startEditName = (id, name) => {
        setEditingName(id);
        setNewName(name);
    };

    const saveName = async (id) => {
        await updateDoc(doc(db, "documents", id), { name: newName });
        setEditingName(null);
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: 300, borderRight: "1px solid #ccc", p: 2 }}>
                <Typography variant="h6">Tus Documentos</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <TextField inputRef={nameRef} label="Nuevo documento" size="small" />
                    <Button onClick={createDoc} variant="contained">Crear</Button>
                </Box>
                <List>
                    {docs.map(docu => (
                        <ListItem
                            key={docu.id}
                            selected={selectedDoc === docu.id}
                            onClick={() => setSelectedDoc(docu.id)}
                            secondaryAction={
                                <>
                                    <IconButton onClick={() => startEditName(docu.id, docu.name)}><Edit /></IconButton>
                                    <IconButton onClick={() => deleteDocument(docu.id)}><Delete /></IconButton>
                                </>
                            }
                        >
                            {editingName === docu.id ? (
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <TextField value={newName} onChange={e => setNewName(e.target.value)} size="small" />
                                    <Button onClick={() => saveName(docu.id)} size="small">Guardar</Button>
                                </Box>
                            ) : (
                                <ListItemText primary={docu.name} />
                            )}
                        </ListItem>
                    ))}
                </List>
                <Button
                    onClick={() => auth.signOut()}
                    startIcon={<Logout />}
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    Cerrar sesión
                </Button>
            </Box>
            <Box sx={{ flex: 1 }}>
                {selectedDoc ? <Editor docId={selectedDoc} /> : <Typography sx={{ mt: 4, textAlign: "center" }}>Selecciona o crea un documento</Typography>}
            </Box>
        </Box>
    );
} 