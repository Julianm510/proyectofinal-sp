import { useEffect, useState } from "react";
import {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  eliminarCliente,
} from "./ClienteService";
import ClienteForm from "./ClienteForm";

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
    await eliminarCliente(id);
    await cargarClientes();
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
