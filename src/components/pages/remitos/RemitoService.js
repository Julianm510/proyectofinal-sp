// src/components/pages/remitos/RemitoService.js
import { db } from "../../../FireBaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

const remitosCollection = collection(db, "remitos");

// Crear Remito
export const crearRemito = async (remito) => {
    const docRef = await addDoc(remitosCollection, {
        ...remito,
        fechaRemito: remito.fechaRemito || new Date().toISOString(),
    });
    return { id: docRef.id, ...remito };
};

// Obtener todos los remitos
export const obtenerRemitos = async () => {
    const snapshot = await getDocs(remitosCollection);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// ✅ Obtener un remito por ID (faltaba esta función)
export const obtenerRemitoPorId = async (id) => {
    const docRef = doc(db, "remitos", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    } else {
        throw new Error("El remito no existe");
    }
};

// Actualizar un remito
export const actualizarRemito = async (id, data) => {
    const docRef = doc(db, "remitos", id);
    await updateDoc(docRef, data);
};

// Eliminar un remito
export const eliminarRemito = async (id) => {
    const docRef = doc(db, "remitos", id);
    await deleteDoc(docRef);
};