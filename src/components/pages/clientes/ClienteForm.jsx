import { useState, useEffect } from "react";

const ClienteForm = ({
  agregarCliente,
  clienteEditar,
  actualizarCliente,
  cancelarEdicion,
}) => {
  const [form, setForm] = useState({
    nombre: "",
    cuit_dni: "",
    direccion: "",
    email: "",
    localidad: "",
  });

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
    setForm({
      nombre: "",
      cuit_dni: "",
      direccion: "",
      email: "",
      localidad: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row g-2">
        <div className="col-md-4">
          <input
            name="nombre"
            className="form-control"
            placeholder="Nombre del cliente"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            name="cuit_dni"
            className="form-control"
            placeholder="CUIT/DNI"
            value={form.cuit_dni}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            name="direccion"
            className="form-control"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            name="localidad"
            className="form-control"
            placeholder="Localidad"
            value={form.localidad}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-3">
        <button type="submit" className="btn btn-warning me-2">
          {clienteEditar ? "Actualizar" : "Agregar Cliente"}
        </button>
        {clienteEditar && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={cancelarEdicion}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ClienteForm;
