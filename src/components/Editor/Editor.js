import React, { useEffect, useRef, useState } from "react";
import { db } from "../../firebase/config";
import { doc, onSnapshot, updateDoc, collection, addDoc, query, orderBy } from "firebase/firestore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Chat from "../Chat/Chat";
import { Box, Typography, Button, List, ListItem, ListItemText, LinearProgress } from "@mui/material";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Editor({ docId }) {
    const [content, setContent] = useState("");
    const [docName, setDocName] = useState("");
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef();
    const updating = useRef(false);

    useEffect(() => {
        setFiles([]); // Limpia la lista de archivos al cambiar de documento
        const refDoc = doc(db, "documents", docId);
        const unsub = onSnapshot(refDoc, (snap) => {
            if (snap.exists()) {
                setDocName(snap.data().name);
                if (!updating.current) setContent(snap.data().content);
            }
        });
        // Escuchar archivos subidos
        const q = query(collection(db, "documents", docId, "files"), orderBy("created", "desc"));
        const unsubFiles = onSnapshot(q, (snap) => {
            setFiles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => { unsub(); unsubFiles(); };
    }, [docId]);

    const handleChange = async (value) => {
        setContent(value);
        updating.current = true;
        await updateDoc(doc(db, "documents", docId), { content: value });
        updating.current = false;
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setProgress(0);
        const storage = getStorage();
        const storageRef = ref(storage, `documents/${docId}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            },
            (error) => {
                setUploading(false);
                setProgress(0);
                alert("Error al subir archivo: " + error.message);
            },
            async () => {
                try {
                    // Siempre usa la URL de getDownloadURL, nunca la construyas manualmente
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    await addDoc(collection(db, "documents", docId, "files"), {
                        name: file.name,
                        url, // Esta es la URL segura para descargar/ver el archivo
                        size: file.size,
                        type: file.type,
                        created: Date.now(),
                    });
                    alert("¡Archivo subido exitosamente!");
                } catch (err) {
                    alert("Error al guardar archivo en Firestore: " + err.message);
                }
                setUploading(false);
                setProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        );
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5">{docName}</Typography>
            <ReactQuill value={content} onChange={handleChange} style={{ height: 300, marginBottom: 20 }} />
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <Button
                    variant="contained"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    sx={{ minWidth: 150 }}
                >
                    {uploading ? "Subiendo..." : "Subir archivo"}
                </Button>
                {uploading && (
                    <Box sx={{ flex: 1 }}>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                )}
            </Box>
            <Typography variant="subtitle1">Archivos subidos:</Typography>
            <List>
                {files.map(f => (
                    <ListItem key={f.id}>
                        <ListItemText
                            primary={
                                // Siempre usa la URL guardada en f.url, que proviene de getDownloadURL()
                                <a href={f.url} target="_blank" rel="noopener noreferrer">{f.name}</a>
                            }
                            secondary={`Tamaño: ${(f.size / 1024).toFixed(2)} KB`}
                        />
                    </ListItem>
                ))}
                {files.length === 0 && <ListItem><ListItemText primary="No hay archivos subidos aún." /></ListItem>}
            </List>
            <Chat docId={docId} />
        </Box>
    );
} 