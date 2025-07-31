// src/components/pedidos/PedidoService.js
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../FireBaseConfig";

const ref = collection(db, "pedidos");

export const crearPedido = (data) => addDoc(ref, data);
export const obtenerPedidos = () => getDocs(ref);
export const actualizarPedido = (id, data) =>
  updateDoc(doc(db, "pedidos", id), data);
export const eliminarPedido = (id) => deleteDoc(doc(db, "pedidos", id));
