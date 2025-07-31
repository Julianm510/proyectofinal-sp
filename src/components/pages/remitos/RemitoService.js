// src/components/remitos/RemitoService.js
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../FireBaseConfig";

const ref = collection(db, "remitos");

export const crearRemito = (data) => addDoc(ref, data);
export const obtenerRemitos = () => getDocs(ref);
export const actualizarRemito = (id, data) => updateDoc(doc(db, "remitos", id), data);
export const eliminarRemito = (id) => deleteDoc(doc(db, "remitos", id));
