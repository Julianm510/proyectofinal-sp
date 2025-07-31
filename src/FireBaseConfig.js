// src/FireBaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBzETxLLdPJFBDbR6a4UPENLQqLs45Xknc",
    authDomain: "tecnocut-proyecto.firebaseapp.com",
    projectId: "tecnocut-proyecto",
    storageBucket: "tecnocut-proyecto.firebasestorage.app",
    messagingSenderId: "63004426386",
    appId: "1:63004426386:web:29533bddeb2e3084da664b",
    measurementId: "G-QTX0NDL3Y0"
};

// Inicializamos la app
const app = initializeApp(firebaseConfig);

// Exportamos la base de datos con nombre "db"
export const db = getFirestore(app);
