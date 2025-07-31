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

  const cargarClientes = async () => {
    const snapshot = await obtenerClientes();
    setClientes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const agregarCliente = async (cliente) => {
    await crearCliente(cliente);
    cargarClientes();
  };

  const guardarActualizacion = async (id, cliente) => {
    await actualizarCliente(id, cliente);
    setClienteEditar(null);
    cargarClientes();
  };

  const borrarCliente = async (id) => {
    await eliminarCliente(id);
    cargarClientes();
  };

  return (
    <div className="container">
      <h2>Gestión de Clientes</h2>
      <ClienteForm
        agregarCliente={agregarCliente}
        clienteEditar={clienteEditar}
        actualizarCliente={guardarActualizacion}
        cancelarEdicion={() => setClienteEditar(null)}
      />
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>CUIT/DNI</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.cuit_dni}</td>
              <td>{c.direccion}</td>
              <td>
                <button className="edit" onClick={() => setClienteEditar(c)}>
                  Editar
                </button>
                <button className="delete" onClick={() => borrarCliente(c.id)}>
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
