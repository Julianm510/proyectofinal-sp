import { useEffect, useState } from "react";
import { obtenerClientes } from "../clientes/ClienteService";
import { obtenerProductos } from "../productos/ProductoService";

const PedidoForm = ({ agregar, pedidoEditar, actualizar, cancelar }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    numeroPedido: "",
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

  const eliminarProductoDelPedido = (index) => {
    setForm((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
    }));
  };

  const actualizarCantidadProducto = (index, nuevaCantidad) => {
    setForm((prev) => {
      const nuevosProductos = [...prev.productos];
      if (nuevaCantidad > 0) {
        nuevosProductos[index].cantidad = parseInt(nuevaCantidad);
      }
      return { ...prev, productos: nuevosProductos };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hoy = new Date();
    const fechaFormateada = `${hoy.getDate()}/${
      hoy.getMonth() + 1
    }/${hoy.getFullYear()}`;

    const nuevo = { ...form, fechaPedido: fechaFormateada };
    if (pedidoEditar) actualizar(pedidoEditar.id, nuevo);
    else agregar(nuevo);

    setForm({
      numeroPedido: "",
      clienteId: "",
      productos: [],
      estado: "pendiente",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="numeroPedido"
        placeholder="N° Pedido"
        value={form.numeroPedido}
        onChange={(e) => setForm({ ...form, numeroPedido: e.target.value })}
      />

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
        <button
          type="button"
          style={{
            backgroundColor: "orange",
            color: "white",
            border: "none",
            padding: "5px 10px",
            marginLeft: "5px",
            cursor: "pointer",
          }}
          onClick={agregarProductoAlPedido}
        >
          Agregar Producto
        </button>
      </div>

      {/* Tabla de productos */}
      {form.productos.length > 0 && (
        <table
          style={{
            width: "100%",
            marginTop: "10px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Producto
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Cantidad
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Precio Unitario
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Subtotal
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {form.productos.map((p, index) => {
              const producto = productos.find(
                (prod) => prod.id === p.productoId
              );
              return (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {producto ? producto.nombre : "Producto eliminado"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <input
                      type="number"
                      min="1"
                      value={p.cantidad}
                      onChange={(e) =>
                        actualizarCantidadProducto(index, e.target.value)
                      }
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ${p.precioUnitario}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ${p.precioUnitario * p.cantidad}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      type="button"
                      style={{
                        backgroundColor: "orange",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                      onClick={() => eliminarProductoDelPedido(index)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button
        type="submit"
        style={{
          backgroundColor: "orange",
          color: "white",
          border: "none",
          padding: "8px 15px",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        {pedidoEditar ? "Actualizar" : "Guardar Pedido"}
      </button>
      {pedidoEditar && (
        <button
          type="button"
          onClick={cancelar}
          style={{
            backgroundColor: "gray",
            color: "white",
            border: "none",
            padding: "8px 15px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      )}
    </form>
  );
};

export default PedidoForm;
