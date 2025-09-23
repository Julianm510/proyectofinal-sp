// src/components/remitos/RemitoForm.jsx
import { useState, useEffect } from "react";
import { crearRemito } from "./RemitoService";

const RemitoForm = ({ pedido, cliente, onSave, remitos, productos }) => {
  const [form, setForm] = useState({
    numeroRemito: "",
    numeroPedido: "",
    clienteNombre: "",
    fechaRemito: new Date().toLocaleDateString(),
    estado: "pendiente",
    productos: [],
  });

  useEffect(() => {
    if (pedido && cliente) {
      setForm({
        numeroRemito: "",
        numeroPedido: pedido.numeroPedido,
        clienteNombre: cliente.nombre,
        fechaRemito: new Date().toLocaleDateString(),
        estado: "pendiente",
        productos: pedido.productos,
      });
    }
  }, [pedido, cliente]);

  const getNextNumeroRemito = () => {
    if (!remitos || remitos.length === 0) return "R-1";
    const ult = remitos[remitos.length - 1].numeroRemito;
    const num = parseInt(ult.replace("R-", "")) + 1;
    return `R-${num}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoRemito = {
      ...form,
      numeroRemito: getNextNumeroRemito(),
    };
    await crearRemito(nuevoRemito);
    if (onSave) onSave();
    setForm({
      numeroRemito: "",
      numeroPedido: "",
      clienteNombre: "",
      fechaRemito: new Date().toLocaleDateString(),
      estado: "pendiente",
      productos: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row g-2">
        <div className="col">
          <input
            name="numeroPedido"
            placeholder="N° Pedido"
            value={form.numeroPedido}
            readOnly
            className="form-control"
          />
        </div>
        <div className="col">
          <input
            name="clienteNombre"
            placeholder="Cliente"
            value={form.clienteNombre}
            readOnly
            className="form-control"
          />
        </div>
        <div className="col">
          <input
            name="fechaRemito"
            placeholder="Fecha"
            value={form.fechaRemito}
            readOnly
            className="form-control"
          />
        </div>
      </div>

      {/* 🔹 Lista de productos con nombre en vez de ID */}
      <ul className="mt-2">
        {form.productos?.map((p, i) => {
          const prod = productos.find((pr) => pr.id === p.productoId);
          return (
            <li key={i}>
              {prod ? prod.nombre : "Producto eliminado"} — {p.cantidad} x $
              {p.precioUnitario}
            </li>
          );
        })}
      </ul>

      <button type="submit" className="btn btn-warning mt-2">
        Guardar Remito
      </button>
    </form>
  );
};

export default RemitoForm;
