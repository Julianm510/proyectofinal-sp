import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerRemitoPorId } from "./RemitoService";

const RemitoDetalle = () => {
  const { id } = useParams(); // ID del remito en la URL
  const [remito, setRemito] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const r = await obtenerRemitoPorId(id);
        setRemito(r);
      } catch (error) {
        console.error("Error cargando remito:", error);
      }
    };

    cargarDatos();
  }, [id]);

  const imprimir = () => {
    window.print();
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";

    // Si ya viene como string tipo DD/MM/YYYY, lo mostramos así
    if (typeof fecha === "string" && fecha.includes("/")) {
      return fecha;
    }

    // Si es formato ISO válido
    const fechaObj = new Date(fecha);
    if (!isNaN(fechaObj.getTime())) {
      return fechaObj.toLocaleDateString();
    }

    return "—";
  };

  if (!remito) {
    return <p>Cargando remito...</p>;
  }

  return (
    <div className="container card p-4 mt-3">
      <h2>Remito N° {remito.numeroRemito || "-"}</h2>
      <hr style={{ border: "2px solid orange", width: "120px" }} />

      <p>
        <strong>Cliente:</strong> {remito.clienteNombre || "—"}
      </p>
      <p>
        <strong>CUIT / DNI:</strong> {remito.clienteCuit || "—"}
      </p>
      <p>
        <strong>Fecha:</strong> {formatearFecha(remito.fechaRemito)}
      </p>
      <p>
        <strong>Observaciones:</strong> {remito.observacion || "—"}
      </p>
      <p>
        <strong>Transportista:</strong> {remito.transportista || "No asignado"}
      </p>

      <h3>Productos</h3>
      {remito.productos && remito.productos.length > 0 ? (
        <table className="table table-striped mt-2">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {remito.productos.map((p, idx) => (
              <tr key={idx}>
                <td>{p.productoNombre || "—"}</td>
                <td>{p.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron productos para este remito.</p>
      )}

      <button className="btn btn-primary mt-3" onClick={imprimir}>
        Imprimir
      </button>
    </div>
  );
};

export default RemitoDetalle;
