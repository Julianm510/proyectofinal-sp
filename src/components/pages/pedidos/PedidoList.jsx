import { useEffect, useState } from "react";
import {
  crearPedido,
  obtenerPedidos,
  actualizarPedido,
  eliminarPedido,
} from "./PedidoService";
import PedidoForm from "./PedidoForm";
import { obtenerClientes } from "../clientes/ClienteService";
import { obtenerProductos } from "../productos/ProductoService";
import { crearRemito } from "../remitos/RemitoService";
import { Link } from "react-router-dom";

const PedidoList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidoEditar, setPedidoEditar] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const snapPedidos = await obtenerPedidos();
    const snapClientes = await obtenerClientes();
    const snapProductos = await obtenerProductos();

    setPedidos(snapPedidos.docs.map((d) => ({ id: d.id, ...d.data() })));
    setClientes(snapClientes.docs.map((d) => ({ id: d.id, ...d.data() })));
    setProductos(snapProductos.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const agregar = async (pedido) => {
    await crearPedido(pedido);
    await cargarDatos();
  };

  const actualizar = async (id, pedido) => {
    await actualizarPedido(id, pedido);
    await cargarDatos();
    setPedidoEditar(null);
  };

  const eliminar = async (id) => {
    await eliminarPedido(id);
    await cargarDatos();
  };

  const generarRemito = async (pedido) => {
    const cliente = clientes.find((c) => c.id === pedido.clienteId);
    if (!cliente) return;

    const remito = {
      clienteId: pedido.clienteId,
      clienteNombre: cliente.nombre,
      fecha: new Date().toLocaleString(),
      productos: pedido.productos,
      estado: "pendiente",
    };

    await crearRemito(remito);
    alert("Remito generado con éxito");
  };

  return (
    <div className="container">
      <h2>Gestión de Pedidos</h2>
      <PedidoForm
        agregar={agregar}
        pedidoEditar={pedidoEditar}
        actualizar={actualizar}
        cancelar={() => setPedidoEditar(null)}
      />

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>N° Pedido</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => {
            const cliente = clientes.find((c) => c.id === p.clienteId);
            return (
              <tr key={p.id}>
                <td>{p.numeroPedido || "—"}</td>
                <td>{cliente ? cliente.nombre : "Cliente eliminado"}</td>
                <td>{p.fechaPedido}</td>
                <td>{p.estado}</td>
                <td>
                  <ul>
                    {p.productos.map((prod, index) => {
                      const producto = productos.find(
                        (pr) => pr.id === prod.productoId
                      );
                      return (
                        <li key={index}>
                          {producto ? producto.nombre : "Producto eliminado"} —{" "}
                          {prod.cantidad} x ${prod.precioUnitario}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td>
                  <button className="edit" onClick={() => setPedidoEditar(p)}>
                    Editar
                  </button>
                  <button className="delete" onClick={() => eliminar(p.id)}>
                    Eliminar
                  </button>
                  <Link to="/remitos">
                    <button className="edit" onClick={() => generarRemito(p)}>
                      Generar Remito
                    </button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoList;
