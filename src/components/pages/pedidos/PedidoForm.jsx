import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { crearPedido, actualizarPedido } from "./PedidoService";
import { obtenerClientes } from "../clientes/ClienteService";
import { obtenerProductos } from "../productos/ProductoService";

const PedidoForm = ({ onSave, pedidoEditar, cancelarEdicion }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [form, setForm] = useState({
    numeroPedido: "",
    clienteId: "",
    productos: [],
    estado: "pendiente",
    transportista: "",
    observacion: "",
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");

  useEffect(() => {
    cargarDatos();
    if (pedidoEditar) setForm(pedidoEditar);
  }, [pedidoEditar]);

  const cargarDatos = async () => {
    const snapClientes = await obtenerClientes();
    const snapProductos = await obtenerProductos();

    const clientesList = snapClientes.docs
      ? snapClientes.docs.map((d) => ({ id: d.id, ...d.data() }))
      : snapClientes;
    const productosList = snapProductos.docs
      ? snapProductos.docs.map((d) => ({ id: d.id, ...d.data() }))
      : snapProductos;

    setClientes(clientesList);
    setProductos(productosList);
  };

  // ➕ Agregar producto al pedido
  const agregarProducto = () => {
    const producto = productos.find((p) => p.id === productoSeleccionado);
    if (!producto || !cantidad || cantidad <= 0) return;

    setForm((prev) => ({
      ...prev,
      productos: [
        ...prev.productos,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: parseInt(cantidad),
          precioUnitario: producto.precioUnitario,
        },
      ],
    }));
    setProductoSeleccionado("");
    setCantidad("");
  };

  // ❌ Eliminar producto del pedido
  const eliminarProducto = (index) => {
    setForm((prev) => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
    }));
  };

  // 🧮 Actualizar cantidad
  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;
    setForm((prev) => {
      const nuevos = [...prev.productos];
      nuevos[index].cantidad = parseInt(nuevaCantidad);
      return { ...prev, productos: nuevos };
    });
  };

  // 💾 Guardar o editar pedido
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.numeroPedido || !form.clienteId || form.productos.length === 0) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Debe ingresar un número de pedido, cliente y al menos un producto.",
        icon: "warning",
      });
      return;
    }

    const hoy = new Date();
    const fechaISO = hoy.toISOString();

    const pedidoData = {
      ...form,
      fecha: fechaISO,
    };

    try {
      if (pedidoEditar) {
        const resultado = await Swal.fire({
          title: "¿Deseas actualizar este pedido?",
          text: "Los cambios serán guardados permanentemente.",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#f39c12",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Sí, actualizar",
          cancelButtonText: "Cancelar",
        });

        if (resultado.isConfirmed) {
          await actualizarPedido(pedidoEditar.id, pedidoData);
          Swal.fire({
            title: "Pedido actualizado",
            text: "El pedido se actualizó correctamente.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          if (onSave) onSave();
          if (cancelarEdicion) cancelarEdicion();
        }
      } else {
        await crearPedido(pedidoData);
        Swal.fire({
          title: "Pedido creado",
          text: "El pedido se registró correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        if (onSave) onSave();
      }

      // Reset del formulario
      setForm({
        numeroPedido: "",
        clienteId: "",
        productos: [],
        estado: "pendiente",
        transportista: "",
        observacion: "",
      });
    } catch (error) {
      console.error("Error al guardar pedido:", error);
      Swal.fire("Error", "No se pudo guardar el pedido.", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "#f9f9f9",
        padding: "15px",
        borderRadius: "10px",
      }}
    >
      <h4>{pedidoEditar ? "Editar Pedido" : "Nuevo Pedido"}</h4>

      {/* Número de pedido */}
      <input
        type="text"
        placeholder="N° Pedido"
        value={form.numeroPedido}
        onChange={(e) => setForm({ ...form, numeroPedido: e.target.value })}
        required
      />

      {/* Cliente */}
      <select
        value={form.clienteId}
        onChange={(e) => setForm({ ...form, clienteId: e.target.value })}
        required
      >
        <option value="">Seleccione un cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {/* Transportista */}
      <input
        type="text"
        placeholder="Transportista"
        value={form.transportista}
        onChange={(e) => setForm({ ...form, transportista: e.target.value })}
      />

      {/* Observación */}
      <input
        type="text"
        placeholder="Observación"
        value={form.observacion}
        onChange={(e) => setForm({ ...form, observacion: e.target.value })}
      />

      {/* Productos */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
          style={{ width: "80px" }}
        />

        <button
          type="button"
          onClick={agregarProducto}
          style={{
            backgroundColor: "orange",
            color: "white",
            border: "none",
            padding: "6px 12px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Agregar
        </button>
      </div>

      {/* Tabla de productos */}
      {form.productos.length > 0 && (
        <table
          style={{
            width: "100%",
            marginTop: "10px",
            borderCollapse: "collapse",
            background: "white",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {form.productos.map((p, index) => (
              <tr key={index}>
                <td>{p.nombre}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={p.cantidad}
                    onChange={(e) => actualizarCantidad(index, e.target.value)}
                    style={{ width: "60px" }}
                  />
                </td>
                <td>${p.precioUnitario}</td>
                <td>${p.precioUnitario * p.cantidad}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => eliminarProducto(index)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Quitar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Botones */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          type="submit"
          style={{
            backgroundColor: "orange",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {pedidoEditar ? "Actualizar Pedido" : "Guardar Pedido"}
        </button>

        {pedidoEditar && (
          <button
            type="button"
            onClick={cancelarEdicion}
            style={{
              backgroundColor: "gray",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default PedidoForm;
