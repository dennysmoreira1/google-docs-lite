import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Opcional

const firebaseConfig = {
    apiKey: "AIzaSyCvh_WtR5uUG4J4AUFM2AmvNiszoR9diL0",
    authDomain: "docs-lite-57fc8.firebaseapp.com",
    projectId: "docs-lite-57fc8",
    storageBucket: "docs-lite-57fc8.appspot.com", // Corregido
    messagingSenderId: "57642710897",
    appId: "1:57642710897:web:70ec63a5e2fe28da0b28d0",
    measurementId: "G-KWYHBDG7PM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app); // Opcional 