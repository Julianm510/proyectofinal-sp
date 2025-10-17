import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  obtenerPedidos,
  eliminarPedido,
  actualizarPedido,
} from "./PedidoService";
import { obtenerClientes } from "../clientes/ClienteService";
import { obtenerProductos } from "../productos/ProductoService";
import PedidoForm from "./PedidoForm";

const PedidoList = () => {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [pedidoEditar, setPedidoEditar] = useState(null);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const pedidosData = await obtenerPedidos();
      const clientesSnap = await obtenerClientes();
      const productosSnap = await obtenerProductos();

      const clientesList = clientesSnap.docs
        ? clientesSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        : clientesSnap;
      const productosList = productosSnap.docs
        ? productosSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        : productosSnap;

      setPedidos(pedidosData);
      setPedidosFiltrados(pedidosData);
      setClientes(clientesList);
      setProductos(productosList);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  // 🔁 Refrescar después de guardar
  const handleGuardar = async () => {
    await cargarDatos();
    setPedidoEditar(null);
  };

  // 🗑️ Eliminar pedido con confirmación
  const eliminar = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar pedido?",
      text: "Esta acción eliminará el pedido permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      await eliminarPedido(id);
      await cargarDatos();
      Swal.fire({
        title: "Pedido eliminado",
        text: "El pedido fue eliminado correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // 🧾 Generar remito
  const generarRemito = (pedido, cliente) => {
    navigate("/remitos", { state: { pedido, cliente } });
  };

  // 🔄 Cambiar estado (Pendiente / Cerrado)
  const cambiarEstado = async (pedido, nuevoEstado) => {
    const resultado = await Swal.fire({
      title: "¿Cambiar estado del pedido?",
      text: `El pedido pasará a estado "${nuevoEstado.toUpperCase()}".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f39c12",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      await actualizarPedido(pedido.id, { ...pedido, estado: nuevoEstado });
      await cargarDatos();
      Swal.fire({
        title: "Estado actualizado",
        text: `El pedido ahora está en estado "${nuevoEstado.toUpperCase()}".`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // 🔍 Buscador
  const handleBuscar = (valor, fecha) => {
    const texto = valor !== undefined ? valor : busqueda;
    const fechaSeleccionada = fecha !== undefined ? fecha : fechaFiltro;

    setBusqueda(texto);
    setFechaFiltro(fechaSeleccionada);

    const filtrados = pedidos.filter((p) => {
      const cliente = clientes.find((c) => c.id === p.clienteId);
      const nombreCliente = cliente?.nombre?.toLowerCase() || "";
      const fechaPedido = p.fecha
        ? new Date(p.fecha).toLocaleDateString("es-AR")
        : "";

      const coincideTexto =
        texto.trim() === "" ||
        p.numeroPedido?.toLowerCase().includes(texto.toLowerCase()) ||
        nombreCliente.includes(texto.toLowerCase()) ||
        fechaPedido.includes(texto);

      const coincideFecha =
        !fechaSeleccionada ||
        (p.fecha &&
          new Date(p.fecha).toISOString().slice(0, 10) === fechaSeleccionada);

      return coincideTexto && coincideFecha;
    });

    setPedidosFiltrados(filtrados);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFechaFiltro("");
    setPedidosFiltrados(pedidos);
  };

  // 📊 Contadores de estado
  const totalPedidos = pedidos.length;
  const pedidosPendientes = pedidos.filter(
    (p) => p.estado !== "cerrado"
  ).length;
  const pedidosCerrados = pedidos.filter((p) => p.estado === "cerrado").length;

  return (
    <div
      className="container"
      style={{
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Gestión de Pedidos
      </h2>

      {/* 📊 Indicadores resumen */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          marginBottom: "25px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            padding: "15px 30px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            minWidth: "250px",
          }}
        >
          <h4 style={{ margin: 0, color: "#333" }}>📦 Total Pedidos</h4>
          <p style={{ fontSize: "22px", fontWeight: "bold", marginTop: "5px" }}>
            {totalPedidos}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff3cd",
            borderRadius: "10px",
            padding: "15px 30px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            minWidth: "250px",
          }}
        >
          <h4 style={{ margin: 0, color: "#856404" }}>🕓 Pendientes</h4>
          <p style={{ fontSize: "22px", fontWeight: "bold", marginTop: "5px" }}>
            {pedidosPendientes}
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#d4edda",
            borderRadius: "10px",
            padding: "15px 30px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
            minWidth: "250px",
          }}
        >
          <h4 style={{ margin: 0, color: "#155724" }}>✅ Cerrados</h4>
          <p style={{ fontSize: "22px", fontWeight: "bold", marginTop: "5px" }}>
            {pedidosCerrados}
          </p>
        </div>
      </div>

      <PedidoForm
        onSave={handleGuardar}
        pedidoEditar={pedidoEditar}
        cancelarEdicion={() => setPedidoEditar(null)}
      />

      <h4 style={{ marginTop: "30px" }}>Pedidos Existentes</h4>

      {/* 🔍 Buscador */}
      <div
        className="my-3"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Buscar por N° pedido, cliente o fecha..."
          value={busqueda}
          onChange={(e) => handleBuscar(e.target.value, undefined)}
          style={{
            width: "40%",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => handleBuscar(undefined, e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "15px",
            color: "#333",
          }}
        />

        <button
          onClick={limpiarFiltros}
          style={{
            backgroundColor: "#f1f1f1",
            color: "#333",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px 14px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
        >
          Limpiar filtros ✖
        </button>
      </div>

      {/* 📋 Tabla de pedidos */}
      <table
        className="table table-striped mt-2"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <thead style={{ backgroundColor: "#f9f9f9" }}>
          <tr>
            <th>N° Pedido</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Transportista</th>
            <th>Observación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", color: "#666" }}>
                No se encontraron pedidos.
              </td>
            </tr>
          ) : (
            pedidosFiltrados.map((p) => {
              const cliente = clientes.find((c) => c.id === p.clienteId);
              return (
                <tr key={p.id}>
                  <td>{p.numeroPedido}</td>
                  <td>{cliente ? cliente.nombre : "Cliente no encontrado"}</td>
                  <td>
                    {p.fecha
                      ? new Date(p.fecha).toLocaleDateString("es-AR")
                      : "—"}
                  </td>
                  <td>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {p.productos?.map((prod, i) => (
                        <li key={i}>
                          {prod.nombre || "Producto"} — {prod.cantidad} x $
                          {prod.precioUnitario}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{p.transportista || "—"}</td>
                  <td>{p.observacion || "—"}</td>

                  {/* 🔄 Estado */}
                  <td style={{ textAlign: "center" }}>
                    <select
                      value={p.estado || "pendiente"}
                      onChange={(e) => cambiarEstado(p, e.target.value)}
                      style={{
                        borderRadius: "6px",
                        padding: "4px 8px",
                        border: "1px solid #ccc",
                        backgroundColor:
                          p.estado === "cerrado" ? "#d4edda" : "#fff3cd",
                        color: p.estado === "cerrado" ? "#155724" : "#856404",
                        fontWeight: "600",
                      }}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="cerrado">Cerrado</option>
                    </select>
                  </td>

                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="edit"
                        onClick={() => setPedidoEditar(p)}
                      >
                        Editar
                      </button>
                      <button className="delete" onClick={() => eliminar(p.id)}>
                        Eliminar
                      </button>
                      <button
                        className="edit"
                        onClick={() => generarRemito(p, cliente)}
                      >
                        Generar Remito
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoList;
