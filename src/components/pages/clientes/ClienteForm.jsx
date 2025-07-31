import { useState, useEffect } from "react";

const ClienteForm = ({
  agregarCliente,
  clienteEditar,
  actualizarCliente,
  cancelarEdicion,
}) => {
  const [form, setForm] = useState({ nombre: "", cuit_dni: "", direccion: "" });

  useEffect(() => {
    if (clienteEditar) setForm(clienteEditar);
  }, [clienteEditar]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clienteEditar) {
      actualizarCliente(clienteEditar.id, form);
    } else {
      agregarCliente(form);
    }
    setForm({ nombre: "", cuit_dni: "", direccion: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        placeholder="Nombre del cliente"
        value={form.nombre}
        onChange={handleChange}
      />
      <input
        name="cuit_dni"
        placeholder="CUIT/DNI"
        value={form.cuit_dni}
        onChange={handleChange}
      />
      <input
        name="direccion"
        placeholder="Dirección"
        value={form.direccion}
        onChange={handleChange}
      />
      <button type="submit">
        {clienteEditar ? "Actualizar" : "Agregar Cliente"}
      </button>
      {clienteEditar && (
        <button type="button" onClick={cancelarEdicion}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default ClienteForm;
