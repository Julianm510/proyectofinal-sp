import { db } from "../../../FireBaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const pedidosCollection = collection(db, "pedidos");

// Crear pedido
export const crearPedido = async (pedido) => {
  const docRef = await addDoc(pedidosCollection, pedido);
  return { id: docRef.id, ...pedido };
};

// Obtener pedidos
export const obtenerPedidos = async () => {
  const snapshot = await getDocs(pedidosCollection);
  return snapshot.docs.map((docu) => ({ id: docu.id, ...docu.data() }));
};

// Actualizar pedido
export const actualizarPedido = async (id, pedidoActualizado) => {
  const pedidoRef = doc(db, "pedidos", id);
  await updateDoc(pedidoRef, pedidoActualizado);
};

// Eliminar pedido ✅
export const eliminarPedido = async (id) => {
  const pedidoRef = doc(db, "pedidos", id);
  await deleteDoc(pedidoRef);
};
