// src/components/pedidos/PedidoForm.jsx
import { useEffect, useState } from "react";
import { obtenerClientes } from "../clientes/ClienteService";
import { obtenerProductos } from "../productos/ProductoService";

const PedidoForm = ({ agregar, pedidoEditar, actualizar, cancelar }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    clienteId: "",
    productos: [],
    estado: "pendiente",
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");

  useEffect(() => {
    obtenerClientes().then((snap) =>
      setClientes(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    obtenerProductos().then((snap) =>
      setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    if (pedidoEditar) setForm(pedidoEditar);
  }, [pedidoEditar]);

  const agregarProductoAlPedido = () => {
    const producto = productos.find((p) => p.id === productoSeleccionado);
    if (producto && cantidad > 0) {
      setForm((prev) => ({
        ...prev,
        productos: [
          ...prev.productos,
          {
            productoId: producto.id,
            cantidad: parseInt(cantidad),
            precioUnitario: producto.precioUnitario,
          },
        ],
      }));
      setProductoSeleccionado("");
      setCantidad("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = { ...form, fechaPedido: new Date().toISOString() };
    if (pedidoEditar) actualizar(pedidoEditar.id, nuevo);
    else agregar(nuevo);
    setForm({ clienteId: "", productos: [], estado: "pendiente" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        name="clienteId"
        value={form.clienteId}
        onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
      >
        <option value="">Seleccione un cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <div>
        <select
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
        >
          <option value="">Seleccione un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <button type="button" onClick={agregarProductoAlPedido}>
          Agregar Producto
        </button>
      </div>

      <ul>
        {form.productos.map((p, index) => (
          <li key={index}>
            {productos.find((prod) => prod.id === p.productoId)?.nombre ||
              "Producto eliminado"}{" "}
            - {p.cantidad} u. x ${p.precioUnitario}
          </li>
        ))}
      </ul>

      <button type="submit">
        {pedidoEditar ? "Actualizar" : "Guardar Pedido"}
      </button>
      {pedidoEditar && (
        <button type="button" onClick={cancelar}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default PedidoForm;
