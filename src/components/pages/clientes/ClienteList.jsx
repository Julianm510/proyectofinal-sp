import { useEffect, useState } from "react";
import {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  eliminarCliente,
} from "./ClienteService";
import ClienteForm from "./ClienteForm";
import Swal from "sweetalert2";

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
    const resultado = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción eliminará al cliente de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      await eliminarCliente(id);
      await cargarClientes();
      Swal.fire({
        title: "Cliente eliminado",
        text: "El cliente se eliminó correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // 🔍 Función para filtrar clientes
  const handleBuscar = (valor) => {
    setBusqueda(valor);
    if (valor.trim() === "") {
      setClientesFiltrados(clientes);
    } else {
      const filtrados = clientes.filter(
        (c) =>
          c.nombre?.toLowerCase().includes(valor.toLowerCase()) ||
          c.cuit_dni?.toLowerCase().includes(valor.toLowerCase()) ||
          c.localidad?.toLowerCase().includes(valor.toLowerCase())
      );
      setClientesFiltrados(filtrados);
    }
  };

  return (
    <div className="container">
      <h2>Gestión de Clientes</h2>

      {/* 🔸 FORMULARIO DE CLIENTES */}
      <ClienteForm
        agregarCliente={agregarCliente}
        clienteEditar={clienteEditar}
        actualizarCliente={actualizarClienteFn}
        cancelarEdicion={() => setClienteEditar(null)}
      />

      {/* 🔸 BARRA DE BÚSQUEDA */}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Buscar cliente por nombre, CUIT o localidad..."
          value={busqueda}
          onChange={(e) => handleBuscar(e.target.value)}
          style={{
            width: "60%",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* 🔸 TABLA DE CLIENTES */}
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
          {clientesFiltrados.length > 0 ? (
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
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
                No se encontraron clientes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;
