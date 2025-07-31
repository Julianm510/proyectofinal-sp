import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../FireBaseConfig";

const ref = collection(db, "clientes");

export const crearCliente = (data) => addDoc(ref, data);
export const obtenerClientes = () => getDocs(ref);
export const actualizarCliente = (id, data) => updateDoc(doc(db, "clientes", id), data);
export const eliminarCliente = (id) => deleteDoc(doc(db, "clientes", id));
