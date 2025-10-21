import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../../FireBaseConfig";
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
    observacion: "",
  });

  // 🔹 Generar número de remito con formato ARCA (0001-00000001)
  const generarNumeroRemito = async () => {
    try {
      const remitosRef = collection(db, "remitos");
      const q = query(remitosRef, orderBy("numeroRemito", "desc"), limit(1));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const ultimo = snapshot.docs[0].data().numeroRemito;
        const ultimoNumero = parseInt(ultimo.split("-")[1], 10);
        const nuevoNumero = (ultimoNumero + 1).toString().padStart(8, "0");
        return `0001-${nuevoNumero}`;
      } else {
        return "0001-00000001";
      }
    } catch (error) {
      console.error("Error generando número de remito:", error);
      return "0001-00000001";
    }
  };

  // 🔹 Inicializar formulario cuando hay pedido + cliente
  useEffect(() => {
    const inicializar = async () => {
      if (pedido && cliente) {
        const numeroRemitoGenerado = await generarNumeroRemito();

        // ✅ Aseguramos formato correcto de fecha (dd/mm/yyyy)
        const hoy = new Date();
        const fechaFormateada = `${hoy
          .getDate()
          .toString()
          .padStart(2, "0")}/${(hoy.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${hoy.getFullYear()}`;

        setForm({
          numeroRemito: numeroRemitoGenerado,
          numeroPedido: pedido.numeroPedido || "",
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
          fechaRemito: pedido.fechaPedido || fechaFormateada,
          estado: "pendiente",
          transportista: pedido.transportista || "",
          observacion: pedido.observacion || "",
        });
      }
    };
    inicializar();
  }, [pedido, cliente, productos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
    } catch (error) {
      console.error("Error al guardar el remito:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mt-3">
      <h4>Nuevo Remito</h4>

      <div className="row">
        <div className="col-md-4 mb-2">
          <label>N° Remito:</label>
          <input
            type="text"
            value={form.numeroRemito}
            readOnly
            className="form-control"
          />
        </div>

        <div className="col-md-4 mb-2">
          <label>N° Pedido:</label>
          <input
            type="text"
            value={form.numeroPedido}
            readOnly
            className="form-control"
          />
        </div>

        <div className="col-md-4 mb-2">
          <label>Fecha:</label>
          <input
            type="text"
            value={form.fechaRemito}
            readOnly
            className="form-control"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-2">
          <label>Cliente:</label>
          <input
            type="text"
            value={form.clienteNombre}
            readOnly
            className="form-control"
          />
        </div>

        <div className="col-md-6 mb-2">
          <label>CUIT / DNI:</label>
          <input
            type="text"
            value={form.clienteCuit}
            readOnly
            className="form-control"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-2">
          <label>Transportista:</label>
          <input
            type="text"
            value={form.transportista}
            onChange={(e) =>
              setForm({ ...form, transportista: e.target.value })
            }
            className="form-control"
          />
        </div>

        <div className="col-md-6 mb-2">
          <label>Observaciones:</label>
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
                <td>${(p.cantidad * p.precioUnitario).toFixed(2)}</td>
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
