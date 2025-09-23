import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerRemitoPorId } from "./RemitoService";
import { obtenerClientes } from "../clientes/ClienteService";
import { obtenerProductos } from "../productos/ProductoService";
import { obtenerPedidos } from "../pedidos/PedidoService";

const RemitoDetalle = () => {
  const { id } = useParams(); // ID del remito en la URL
  const [remito, setRemito] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // ✅ Obtener el remito por ID
        const r = await obtenerRemitoPorId(id);
        setRemito(r);

        // ✅ Obtener pedidos (ya devuelve array, no snapshot)
        const pedidosList = await obtenerPedidos();
        const pedidoEncontrado = pedidosList.find((p) => p.id === r.pedidoId);
        setPedido(pedidoEncontrado);

        // ✅ Obtener cliente del pedido
        if (pedidoEncontrado?.clienteId) {
          const clientesSnap = await obtenerClientes();
          const clientesList = clientesSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          const clienteEncontrado = clientesList.find(
            (c) => c.id === pedidoEncontrado.clienteId
          );
          setCliente(clienteEncontrado);
        }

        // ✅ Obtener productos
        const productosSnap = await obtenerProductos();
        const productosList = productosSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setProductos(productosList);
      } catch (error) {
        console.error("Error cargando remito:", error);
      }
    };

    cargarDatos();
  }, [id]);

  const getNombreProducto = (productoId) => {
    const prod = productos.find((p) => p.id === productoId);
    return prod ? prod.nombre : "Producto desconocido";
  };

  const imprimir = () => {
    window.print();
  };

  if (!remito) {
    return <p>Cargando remito...</p>;
  }

  return (
    <div className="container">
      <h2>Remito N° {remito.numeroRemito}</h2>

      <p>
        <strong>Cliente:</strong>{" "}
        {cliente ? cliente.nombre : "Cliente no encontrado"}
      </p>
      <p>
        <strong>CUIT / DNI:</strong> {cliente ? cliente.cuit_dni : "—"}
      </p>
      <p>
        <strong>Fecha:</strong>{" "}
        {remito.fechaRemito
          ? new Date(remito.fechaRemito).toLocaleDateString()
          : "-"}
      </p>
      <p>
        <strong>Observaciones:</strong> {remito.observaciones || "—"}
      </p>
      <p>
        <strong>Transportista:</strong> {remito.transportista || "No asignado"}
      </p>

      <h3>Productos</h3>
      {pedido && pedido.productos ? (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {pedido.productos.map((prod, idx) => (
              <tr key={idx}>
                <td>{getNombreProducto(prod.productoId)}</td>
                <td>{prod.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron productos para este remito.</p>
      )}

      <button onClick={imprimir}>Imprimir</button>
    </div>
  );
};

export default RemitoDetalle;
