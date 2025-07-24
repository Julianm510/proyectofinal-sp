import { useState } from "react";
import "./Clientes.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cuit, setCuit] = useState("");
  const [direccion, setDireccion] = useState("");
  const [localidad, setLocalidad] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoCliente = {
      id: Date.now(),
      nombre,
      cuit,
      direccion,
      localidad,
    };

    setClientes([...clientes, nuevoCliente]);

    // Limpiar campos
    setNombre("");
    setCuit("");
    setDireccion("");
    setLocalidad("");
  };

  return (
    <div className="container">
      <h2>Gestión de Clientes</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CUIT/DNI"
          value={cuit}
          onChange={(e) => setCuit(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Localidad"
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
        />
        <button type="submit">Agregar Cliente</button>
      </form>

      <hr />

      <h3>Lista de Clientes</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>CUIT/DNI</th>
            <th>Dirección</th>
            <th>Localidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.cuit}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.localidad}</td>
              <td>
                <button>Editar</button> <button>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
