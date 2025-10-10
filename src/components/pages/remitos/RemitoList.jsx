import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import RemitoForm from "./RemitoForm";
import { obtenerRemitos, eliminarRemito } from "./RemitoService";
import { obtenerProductos } from "../productos/ProductoService";

const RemitoList = () => {
  const location = useLocation();
  const pedido = location.state?.pedido || null;
  const cliente = location.state?.cliente || null;

  const [remitos, setRemitos] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const remitosData = await obtenerRemitos();
    const snapProductos = await obtenerProductos();
    setRemitos(remitosData);
    setProductos(snapProductos.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // ✅ Confirmación elegante antes de eliminar un remito
  const eliminar = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar remito?",
      text: "Esta acción eliminará el remito de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      await eliminarRemito(id);
      await cargarDatos();
      Swal.fire({
        title: "Remito eliminado",
        text: "El remito se eliminó correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="container">
      <h2>Gestión de Remitos</h2>

      {/* ✅ Formulario de creación */}
      <RemitoForm
        pedido={pedido}
        cliente={cliente}
        onSave={async () => {
          await cargarDatos();
          Swal.fire({
            title: "Remito generado",
            text: "El remito se creó correctamente.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }}
        remitos={remitos}
        productos={productos}
      />

      <h4 className="mt-4">Remitos Existentes</h4>

      <table className="table table-striped mt-2">
        <thead>
          <tr>
            <th>N° Remito</th>
            <th>N° Pedido</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {remitos.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "#666" }}>
                No hay remitos registrados
              </td>
            </tr>
          ) : (
            remitos.map((r) => (
              <tr key={r.id}>
                <td>{r.numeroRemito}</td>
                <td>{r.numeroPedido}</td>
                <td>{r.clienteNombre}</td>
                <td>
                  {r.fechaRemito
                    ? new Date(r.fechaRemito).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {r.productos?.map((p, i) => {
                      const prod = productos.find(
                        (pr) => pr.id === p.productoId
                      );
                      return (
                        <li key={i}>
                          {prod ? prod.nombre : "Producto eliminado"} —{" "}
                          {p.cantidad} x ${p.precioUnitario}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link to={`/remitos/${r.id}`}>
                      <button className="edit">Ver</button>
                    </Link>
                    <button
                      className="delete"
                      onClick={() => eliminar(r.id)}
                      style={{ minWidth: "85px" }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RemitoList;
