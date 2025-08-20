// src/components/remitos/RemitoDetalle.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../FireBaseConfig";

const RemitoDetalle = () => {
  const { id } = useParams();
  const [remito, setRemito] = useState(null);
  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const remSnap = await getDoc(doc(db, "remitos", id));
      if (!remSnap.exists()) return;

      const rem = remSnap.data();
      setRemito(rem);

      const pedidoSnap = await getDoc(doc(db, "pedidos", rem.pedidoId));
      if (pedidoSnap.exists()) {
        const pedidoData = pedidoSnap.data();
        setPedido(pedidoData);

        const clienteSnap = await getDoc(
          doc(db, "clientes", pedidoData.clienteId)
        );
        if (clienteSnap.exists()) setCliente(clienteSnap.data());
      }
    };
    cargar();
  }, [id]);

  if (!remito || !pedido || !cliente) return <p>Cargando remito...</p>;

  return (
    <div className="container" style={{ background: "#fff", padding: "2rem" }}>
      <h2>Remito N° {remito.numeroRemito}</h2>
      <p>
        <strong>Cliente:</strong> {cliente.nombre}
      </p>
      <p>
        <strong>Dirección:</strong> {cliente.direccion}
      </p>
      <p>
        <strong>CUIT/DNI:</strong> {cliente.cuit_dni}
      </p>
      <p>
        <strong>Fecha:</strong> {remito.fechaRemito?.slice(0, 10)}
      </p>
      <p>
        <strong>Estado:</strong> {remito.estado}
      </p>
      <p>
        <strong>Transportista:</strong> {remito.transportista}
      </p>
      <p>
        <strong>Observaciones:</strong> {remito.observaciones}
      </p>

      <hr />

      <h3>Detalle del Pedido</h3>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.productos.map((item, idx) => (
            <tr key={idx}>
              <td>{item.productoId}</td>
              <td>{item.cantidad}</td>
              <td>${item.precioUnitario}</td>
              <td>${item.cantidad * item.precioUnitario}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        <strong>Total:</strong> $
        {pedido.productos
          .reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0)
          .toFixed(2)}
      </p>

      <button onClick={() => window.print()}>🖨️ Imprimir</button>
    </div>
  );
};

export default RemitoDetalle;
