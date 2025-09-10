import { db } from "../../../FireBaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

const clientesCollection = collection(db, "clientes");

// Crear un cliente nuevo
export const crearCliente = async (cliente) => {
    // nos aseguramos de guardar todos los campos, incluso si están vacíos
    return await addDoc(clientesCollection, {
        nombre: cliente.nombre || "",
        cuit_dni: cliente.cuit_dni || "",
        direccion: cliente.direccion || "",
        email: cliente.email || "",
        localidad: cliente.localidad || "",
    });
};

// Obtener todos los clientes
export const obtenerClientes = async () => {
    return await getDocs(clientesCollection);
};

// Actualizar un cliente existente
export const actualizarCliente = async (id, cliente) => {
    const clienteRef = doc(db, "clientes", id);
    return await updateDoc(clienteRef, {
        nombre: cliente.nombre || "",
        cuit_dni: cliente.cuit_dni || "",
        direccion: cliente.direccion || "",
        email: cliente.email || "",
        localidad: cliente.localidad || "",
    });
};

// Eliminar un cliente
export const eliminarCliente = async (id) => {
    const clienteRef = doc(db, "clientes", id);
    return await deleteDoc(clienteRef);
};
