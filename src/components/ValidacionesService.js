// src/components/utils/ValidacionesService.js
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../FireBaseConfig";

// 🔹 Verifica si un cliente tiene pedidos pendientes
export const clienteTienePedidosPendientes = async (clienteId) => {
    try {
        const q = query(collection(db, "pedidos"), where("clienteId", "==", clienteId));
        const snapshot = await getDocs(q);
        return snapshot.docs.some((d) => d.data().estado === "pendiente");
    } catch (error) {
        console.error("Error verificando pedidos del cliente:", error);
        return false;
    }
};

// 🔹 Verifica si un producto está incluido en pedidos pendientes
export const productoTienePedidosPendientes = async (productoId) => {
    try {
        const q = query(collection(db, "pedidos"));
        const snapshot = await getDocs(q);

        // buscamos si algún pedido pendiente incluye el producto
        return snapshot.docs.some((doc) => {
            const data = doc.data();
            if (data.estado !== "pendiente") return false;
            return data.productos?.some((p) => p.productoId === productoId);
        });
    } catch (error) {
        console.error("Error verificando pedidos del producto:", error);
        return false;
    }
};
