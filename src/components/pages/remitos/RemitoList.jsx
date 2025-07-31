import { useEffect, useState } from "react";
import {
  crearRemito,
  obtenerRemitos,
  actualizarRemito,
  eliminarRemito,
} from "./RemitoService";
import RemitoForm from "./RemitoForm";
import { obtenerPedidos } from "../pedidos/PedidoService";
import { obtenerClientes } from "../clientes/ClienteService";

const RemitoList = () => {
  const [remitos, setRemitos] = useState([]);
  const [remitoEditar, setRemitoEditar] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const cargar = async () => {
    const remitosSnap = await obtenerRemitos();
    setRemitos(remitosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const pedidosSnap = await obtenerPedidos();
    setPedidos(pedidosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    const clientesSnap = await obtenerClientes();
    setClientes(clientesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    cargar();
  }, []);

  const getClienteNombre = (pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    const cliente = clientes.find((c) => c.id === pedido?.clienteId);
    return cliente?.nombre || "Desconocido";
  };

  const getMontoTotal = (pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    return (
      pedido?.productos?.reduce(
        (acc, item) => acc + item.cantidad * item.precioUnitario,
        0
      ) ?? 0
    );
  };

  return (
    <div className="container">
      <h2>Gestión de Remitos</h2>
      <RemitoForm
        agregar={async (r) => {
          await crearRemito(r);
          cargar();
        }}
        actualizar={async (id, r) => {
          await actualizarRemito(id, r);
          setRemitoEditar(null);
          cargar();
        }}
        remitoEditar={remitoEditar}
        cancelar={() => setRemitoEditar(null)}
      />
      <table>
        <thead>
          <tr>
            <th>N° Remito</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Transportista</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {remitos.map((r) => (
            <tr key={r.id}>
              <td>{r.numeroRemito}</td>
              <td>{getClienteNombre(r.pedidoId)}</td>
              <td>{r.fechaRemito?.slice(0, 10)}</td>
              <td>${getMontoTotal(r.pedidoId).toFixed(2)}</td>
              <td>{r.transportista}</td>
              <td>
                <button className="edit" onClick={() => setRemitoEditar(r)}>
                  Editar
                </button>
                <button
                  className="delete"
                  onClick={() => eliminarRemito(r.id).then(cargar)}
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

export default RemitoList;
