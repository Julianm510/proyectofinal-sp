import { useEffect, useState } from "react";
import {
  crearPedido,
  obtenerPedidos,
  actualizarPedido,
  eliminarPedido,
} from "./PedidoService";
import PedidoForm from "./PedidoForm";
import RemitoForm from "../remitos/RemitoForm";
import { crearRemito } from "../remitos/RemitoService";

const PedidoList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoEditar, setPedidoEditar] = useState(null);
  const [pedidoParaRemito, setPedidoParaRemito] = useState(null);

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

      {/* Formulario para generar remito desde pedido */}
      {pedidoParaRemito && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Generar Remito para Pedido #{pedidoParaRemito.id}</h3>
          <RemitoForm
            pedidoBase={pedidoParaRemito}
            agregar={async (remito) => {
              await crearRemito(remito);
              setPedidoParaRemito(null);
            }}
            cancelar={() => setPedidoParaRemito(null)}
          />
        </div>
      )}

      {/* Formulario de pedido */}
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
        cancelar={() => setPedidoEditar(null)}
        pedidoEditar={pedidoEditar}
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
                <button className="edit" onClick={() => setPedidoParaRemito(p)}>
                  Generar Remito
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
