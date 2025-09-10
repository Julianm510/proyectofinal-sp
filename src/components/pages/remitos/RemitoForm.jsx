// src/components/remitos/RemitoForm.jsx
import { useState, useEffect } from "react";
import { obtenerPedidos } from "../pedidos/PedidoService";

const RemitoForm = ({ agregar, actualizar, cancelar, remitoEditar }) => {
  const [form, setForm] = useState({
    pedidoId: "",
    fechaRemito: "",
    numeroRemito: "",
    transportista: "",
    observaciones: "",
  });

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    obtenerPedidos().then((snap) =>
      setPedidos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    if (remitoEditar) setForm(remitoEditar);
  }, [remitoEditar]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      fechaRemito: form.fechaRemito || new Date().toISOString(),
    };
    if (remitoEditar) actualizar(remitoEditar.id, data);
    else agregar(data);
    setForm({
      pedidoId: "",
      fechaRemito: "",
      numeroRemito: "",
      transportista: "",
      observaciones: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="pedidoId" value={form.pedidoId} onChange={handleChange}>
        <option value="">Seleccionar Pedido</option>
        {pedidos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.id} - {p.fechaPedido?.slice(0, 10)}
          </option>
        ))}
      </select>
      <input
        name="fechaRemito"
        type="date"
        value={form.fechaRemito.slice(0, 10)}
        onChange={handleChange}
      />
      <input
        name="numeroRemito"
        placeholder="N° Remito"
        value={form.numeroRemito}
        onChange={handleChange}
      />
      <input
        name="transportista"
        placeholder="Transportista"
        value={form.transportista}
        onChange={handleChange}
      />
      <input
        name="observaciones"
        placeholder="Observaciones"
        value={form.observaciones}
        onChange={handleChange}
      />
      {/* <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Estado</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="pendiente">Pendiente</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div> */}
      <button type="submit">
        {remitoEditar ? "Actualizar" : "Generar Remito"}
      </button>
      {remitoEditar && (
        <button type="button" onClick={cancelar}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default RemitoForm;
