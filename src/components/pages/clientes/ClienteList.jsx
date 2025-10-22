import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  eliminarCliente,
} from "./ClienteService";
import ClienteForm from "./ClienteForm";
import { clienteTienePedidosPendientes } from "../../ValidacionesService";

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const snap = await obtenerClientes();
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setClientes(lista);
    setClientesFiltrados(lista);
  };

  const agregarCliente = async (cliente) => {
    await crearCliente(cliente);
    await cargarClientes();
  };

  const actualizarClienteFn = async (id, cliente) => {
    await actualizarCliente(id, cliente);
    await cargarClientes();
    setClienteEditar(null);
  };

  const eliminarClienteFn = async (id) => {
    const tienePedidos = await clienteTienePedidosPendientes(id);

    if (tienePedidos) {
      Swal.fire({
        icon: "error",
        title: "No se puede eliminar",
        text: "Este cliente tiene pedidos pendientes.",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarCliente(id);
        await cargarClientes();
        Swal.fire({
          icon: "success",
          title: "Cliente eliminado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  // 🔍 Función de búsqueda dinámica
  const handleBuscar = (valor) => {
    setBusqueda(valor);

    const filtrados = clientes.filter(
      (c) =>
        c.nombre?.toLowerCase().includes(valor.toLowerCase()) ||
        c.cuit_dni?.toLowerCase().includes(valor.toLowerCase()) ||
        c.email?.toLowerCase().includes(valor.toLowerCase()) ||
        c.direccion?.toLowerCase().includes(valor.toLowerCase()) ||
        c.localidad?.toLowerCase().includes(valor.toLowerCase())
    );

    setClientesFiltrados(filtrados);
  };

  // 🔄 Limpiar búsqueda
  const limpiarFiltros = () => {
    setBusqueda("");
    setClientesFiltrados(clientes);
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Clientes</h2>

      <ClienteForm
        agregarCliente={agregarCliente}
        clienteEditar={clienteEditar}
        actualizarCliente={actualizarClienteFn}
        cancelarEdicion={() => setClienteEditar(null)}
      />

      {/* 🔍 Buscador */}
      <div
        className="my-3"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Buscar cliente por nombre, CUIT/DNI, email o localidad..."
          value={busqueda}
          onChange={(e) => handleBuscar(e.target.value)}
          style={{
            width: "45%",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />

        <button
          onClick={limpiarFiltros}
          style={{
            backgroundColor: "#f1f1f1",
            color: "#333",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
        >
          Limpiar filtros ✖
        </button>
      </div>

      {/* 🧾 Tabla de clientes */}
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>CUIT/DNI</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Localidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#666" }}>
                No se encontraron clientes.
              </td>
            </tr>
          ) : (
            clientesFiltrados.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.cuit_dni}</td>
                <td>{c.direccion}</td>
                <td>{c.email}</td>
                <td>{c.localidad}</td>
                <td>
                  <button className="edit" onClick={() => setClienteEditar(c)}>
                    Editar
                  </button>
                  <button
                    className="delete"
                    onClick={() => eliminarClienteFn(c.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;
