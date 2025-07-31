// src/components/pedidos/PedidoList.jsx
import { useEffect, useState } from "react";
import {
  crearPedido,
  obtenerPedidos,
  actualizarPedido,
  eliminarPedido,
} from "./PedidoService";
import PedidoForm from "./PedidoForm";

const PedidoList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEditar, setPedidoEditar] = useState(null);

  const cargarPedidos = async () => {
    const snapshot = await obtenerPedidos();
    setPedidos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  return (
    <div className="container">
      <h2>Gestión de Pedidos</h2>
      <PedidoForm
        agregar={async (p) => {
          await crearPedido(p);
          cargarPedidos();
        }}
        actualizar={async (id, p) => {
          await actualizarPedido(id, p);
          setPedidoEditar(null);
          cargarPedidos();
        }}
        pedidoEditar={pedidoEditar}
        cancelar={() => setPedidoEditar(null)}
      />
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.clienteId}</td>
              <td>{new Date(p.fechaPedido).toLocaleString()}</td>
              <td>{p.estado}</td>
              <td>
                <ul>
                  {p.productos.map((prod, idx) => (
                    <li key={idx}>
                      {prod.cantidad} x ${prod.precioUnitario}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <button className="edit" onClick={() => setPedidoEditar(p)}>
                  Editar
                </button>
                <button
                  className="delete"
                  onClick={() => eliminarPedido(p.id).then(cargarPedidos)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoList;
