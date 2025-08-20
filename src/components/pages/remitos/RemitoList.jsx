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
import { obtenerProductos } from "../productos/ProductoService";
import { Link } from "react-router-dom";

const RemitoList = () => {
  const [remitos, setRemitos] = useState([]);
  const [remitoEditar, setRemitoEditar] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const cargar = async () => {
    try {
      const remitosData = await obtenerRemitos();
      setRemitos(remitosData); // ✅ ya es array

      const pedidosSnap = await obtenerPedidos();
      setPedidos(pedidosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const clientesSnap = await obtenerClientes();
      setClientes(clientesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const productosSnap = await obtenerProductos();
      setProductos(productosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const getClienteNombre = (pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    const cliente = clientes.find((c) => c.id === pedido?.clienteId);
    return cliente?.nombre || "Desconocido";
  };

  const getClienteCuit = (pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    const cliente = clientes.find((c) => c.id === pedido?.clienteId);
    return cliente?.cuit || cliente?.dni || "Sin datos";
  };

  const getNombreProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    return producto ? producto.nombre : "Producto no encontrado";
  };

  const getProductosPedido = (pedidoId) => {
    const pedido = pedidos.find((p) => p.id === pedidoId);
    return pedido?.productos || [];
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

            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {remitos.map((r) => (
            <tr key={r.id}>
              <td>{r.numeroRemito}</td>
              <td>{getClienteNombre(r.pedidoId)}</td>

              <td>{r.fechaRemito?.slice(0, 10)}</td>

              <td>
                <Link to={`/remito/${r.id}`}>
                  <button>Ver / Imprimir</button>
                </Link>
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
