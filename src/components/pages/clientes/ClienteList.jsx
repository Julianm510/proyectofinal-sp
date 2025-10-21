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

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const snap = await obtenerClientes();
    setClientes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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

  return (
    <div>
      <h2>Gestión de Clientes</h2>
      <ClienteForm
        agregarCliente={agregarCliente}
        clienteEditar={clienteEditar}
        actualizarCliente={actualizarClienteFn}
        cancelarEdicion={() => setClienteEditar(null)}
      />

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
          {clientes.map((c) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;
