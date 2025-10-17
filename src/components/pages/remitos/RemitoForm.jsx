import { useEffect, useState } from "react";
import { crearRemito } from "./RemitoService";

const RemitoForm = ({ pedido, cliente, onSave, productos }) => {
  const [form, setForm] = useState({
    numeroRemito: "",
    numeroPedido: "",
    clienteId: "",
    clienteNombre: "",
    clienteCuit: "",
    productos: [],
    fechaRemito: "",
    estado: "pendiente",
    transportista: "",
    observaciones: "",
  });

  useEffect(() => {
    if (pedido && cliente) {
      setForm({
        numeroRemito: `R-${Date.now()}`, // número de remito autogenerado
        numeroPedido: pedido.numeroPedido,
        clienteId: cliente.id,
        clienteNombre: cliente.nombre,
        clienteCuit: cliente.cuit_dni || "",
        productos: pedido.productos.map((p) => {
          const prod = productos.find((pr) => pr.id === p.productoId);
          return {
            productoId: p.productoId,
            productoNombre: prod ? prod.nombre : "Producto eliminado",
            cantidad: p.cantidad,
            precioUnitario: p.precioUnitario,
          };
        }),
        // ✅ Corregido: si el pedido ya tiene fecha la usamos como string,
        // sino usamos la fecha actual
        fechaRemito: pedido.fechaPedido
          ? pedido.fechaPedido
          : new Date().toISOString(),
        estado: "pendiente",
        transportista: pedido.transportista || "",
        observacion: pedido.observacion || "",
      });
    }
  }, [pedido, cliente, productos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await crearRemito(form);
    onSave();
    setForm({
      numeroRemito: "",
      numeroPedido: "",
      clienteId: "",
      clienteNombre: "",
      clienteCuit: "",
      productos: [],
      fechaRemito: "",
      estado: "pendiente",
      transportista: "",
      observacion: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mt-3">
      <div>
        <h4>Nuevo Remito: </h4>
      </div>
      <div>
        {" "}
        <div className="mb-2">
          <label>N° Remito: </label>
          <input
            type="text"
            value={form.numeroRemito}
            readOnly
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>N° Pedido: </label>
          <input
            type="text"
            value={form.numeroPedido}
            readOnly
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Cliente: </label>
          <input
            type="text"
            value={form.clienteNombre}
            readOnly
            className="form-control"
          />
        </div>
      </div>
      <div>
        {" "}
        <div className="mb-2">
          <label>CUIT / DNI: </label>
          <input
            type="text"
            value={form.clienteCuit}
            readOnly
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Transportista: </label>
          <input
            type="text"
            value={form.transportista}
            onChange={(e) =>
              setForm({ ...form, transportista: e.target.value })
            }
            className="form-control"
          />
        </div>
        <div className="mb-2">
          <label>Observaciones: </label>
          <input
            type="text"
            value={form.observacion}
            onChange={(e) => setForm({ ...form, observacion: e.target.value })}
            className="form-control"
          />
        </div>
      </div>

      {/* Tabla de productos */}
      {form.productos.length > 0 && (
        <table className="table table-striped mt-2">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {form.productos.map((p, idx) => (
              <tr key={idx}>
                <td>{p.productoNombre}</td>
                <td>{p.cantidad}</td>
                <td>${p.precioUnitario}</td>
                <td>${p.cantidad * p.precioUnitario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button type="submit" className="btn btn-primary mt-3">
        Guardar Remito
      </button>
    </form>
  );
};

export default RemitoForm;
