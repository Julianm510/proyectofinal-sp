// src/components/productos/ProductoService.js
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../FireBaseConfig";

const ref = collection(db, "productos");

export const crearProducto = (data) => addDoc(ref, data);
export const obtenerProductos = () => getDocs(ref);
export const actualizarProducto = (id, data) => updateDoc(doc(db, "productos", id), data);
export const eliminarProducto = (id) => deleteDoc(doc(db, "productos", id));
