# Google Docs Lite

Una plataforma web colaborativa tipo Google Docs desarrollada con React y Firebase, que permite a los usuarios crear, editar y compartir documentos en tiempo real.

## 🚀 Características

- **Autenticación de usuarios** - Registro e inicio de sesión con email y contraseña
- **Gestión de documentos** - Crear, renombrar, eliminar y seleccionar documentos personales
- **Edición colaborativa en tiempo real** - Múltiples usuarios pueden editar simultáneamente
- **Chat integrado** - Chat en tiempo real para cada documento
- **Modo claro y oscuro** - Interfaz adaptable a la preferencia del usuario
- **Subida de archivos** - Subir imágenes, PDFs y otros archivos a cada documento
- **Interfaz responsiva** - Diseño moderno con Material UI

## 🛠️ Tecnologías utilizadas

- **React** (con hooks y Context API)
- **Firebase** (Authentication, Firestore, Storage)
- **Material UI** (diseño y componentes)
- **React Quill** (editor de texto enriquecido)

## 📦 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/google-docs-lite.git
   cd google-docs-lite
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura Firebase:**
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilita Authentication (Email/Password)
   - Habilita Firestore Database
   - Habilita Storage (opcional, para subida de archivos)
   - Copia tus credenciales en `src/firebase/config.js`

4. **Inicia la aplicación:**
   ```bash
   npm start
   ```

## 🔧 Configuración de Firebase

### Estructura de la base de datos:
```
documents/
  ├── {documentId}/
  │   ├── name: string
  │   ├── content: string
  │   ├── owner: string
  │   ├── created: timestamp
  │   └── files/
  │       └── {fileId}/
  │           ├── name: string
  │           ├── url: string
  │           ├── size: number
  │           ├── type: string
  │           └── created: timestamp
```

### Reglas de Firestore (desarrollo):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Reglas de Storage (desarrollo):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── Dashboard/
│   │   └── Dashboard.js
│   ├── Editor/
│   │   └── Editor.js
│   └── Chat/
│       └── Chat.js
├── contexts/
│   └── AuthContext.js
├── firebase/
│   └── config.js
├── App.js
└── index.js
```

## 🎯 Funcionalidades principales

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión con email y contraseña
- Gestión de sesiones con Context API

### Gestión de documentos
- Crear nuevos documentos
- Renombrar documentos existentes
- Eliminar documentos
- Lista de documentos del usuario

### Editor colaborativo
- Editor de texto enriquecido con React Quill
- Sincronización en tiempo real con Firestore
- Múltiples usuarios pueden editar simultáneamente
- Historial de cambios automático

### Chat en tiempo real
- Chat específico para cada documento
- Mensajes en tiempo real
- Identificación del usuario que envía cada mensaje

### Subida de archivos
- Subir cualquier tipo de archivo
- Almacenamiento en Firebase Storage
- Lista de archivos por documento
- Enlaces de descarga seguros

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno de Firebase
3. ¡Listo!

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. ¡Listo!

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

**Tu Nombre** - [GitHub](https://github.com/tu-usuario)

---

⭐ Si este proyecto te ayudó, ¡dale una estrella! 