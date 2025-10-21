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
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [remitosFiltrados, setRemitosFiltrados] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(!!pedido);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const remitosData = await obtenerRemitos();
    const snapProductos = await obtenerProductos();

    setRemitos(remitosData);
    setProductos(snapProductos.docs.map((d) => ({ id: d.id, ...d.data() })));
    setRemitosFiltrados(remitosData);
  };

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

  const handleGuardarRemito = async () => {
    await cargarDatos();
    Swal.fire({
      title: "Remito generado",
      text: "El remito se creó correctamente.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    setMostrarFormulario(false);
  };

  // ✅ Función para formatear cualquier tipo de fecha correctamente
  const formatearFecha = (fecha) => {
    if (!fecha) return "—";

    // Si viene como objeto de Firebase Timestamp
    if (fecha.seconds) {
      const date = new Date(fecha.seconds * 1000);
      return date.toLocaleDateString("es-AR");
    }

    // Si viene en formato dd/mm/yyyy (ya está bien)
    if (typeof fecha === "string" && fecha.includes("/")) {
      return fecha;
    }

    // Si viene como string ISO (2025-10-15T00:00:00Z)
    const parsed = new Date(fecha);
    if (!isNaN(parsed)) {
      return parsed.toLocaleDateString("es-AR");
    }

    return "—";
  };

  // ✅ Filtro combinado (texto + fecha)
  const handleBuscar = (valor, fecha) => {
    const texto = valor !== undefined ? valor : busqueda;
    const fechaSeleccionada = fecha !== undefined ? fecha : fechaFiltro;

    setBusqueda(texto);
    setFechaFiltro(fechaSeleccionada);

    const filtrados = remitos.filter((r) => {
      const fechaRemito = formatearFecha(r.fechaRemito);
      const coincideTexto =
        texto.trim() === "" ||
        r.numeroRemito?.toLowerCase().includes(texto.toLowerCase()) ||
        r.numeroPedido?.toLowerCase().includes(texto.toLowerCase()) ||
        r.clienteNombre?.toLowerCase().includes(texto.toLowerCase()) ||
        fechaRemito.includes(texto);

      const coincideFecha =
        !fechaSeleccionada ||
        (r.fechaRemito &&
          new Date(formatearFecha(r.fechaRemito).split("/").reverse().join("-"))
            .toISOString()
            .slice(0, 10) === fechaSeleccionada);

      return coincideTexto && coincideFecha;
    });

    setRemitosFiltrados(filtrados);
  };

  // ✅ Limpiar filtros
  const limpiarFiltros = () => {
    setBusqueda("");
    setFechaFiltro("");
    setRemitosFiltrados(remitos);
  };

  return (
    <div className="container">
      <h2>Gestión de Remitos</h2>

      {/* ✅ Formulario solo visible si venís desde pedidos */}
      {mostrarFormulario && (
        <RemitoForm
          pedido={pedido}
          cliente={cliente}
          onSave={handleGuardarRemito}
          remitos={remitos}
          productos={productos}
        />
      )}

      {/* ✅ Tabla + buscador si no se muestra el formulario */}
      {!mostrarFormulario && (
        <>
          <h4 className="mt-4">Remitos Existentes</h4>

          {/* 🔍 Buscador con campo de fecha y botón limpiar */}
          <div
            className="my-3"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Buscar por N° remito, N° pedido, cliente o fecha..."
              value={busqueda}
              onChange={(e) => handleBuscar(e.target.value, undefined)}
              style={{
                width: "40%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />

            <button
              onClick={limpiarFiltros}
              style={{
                backgroundColor: "#f1f1f1",
                color: "#333",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "500",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e4e4e4")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f1f1f1")
              }
            >
              Limpiar filtros ✖
            </button>
          </div>

          {/* 🧾 Tabla */}
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
              {remitosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", color: "#666" }}
                  >
                    No se encontraron remitos.
                  </td>
                </tr>
              ) : (
                remitosFiltrados.map((r) => (
                  <tr key={r.id}>
                    <td>{r.numeroRemito}</td>
                    <td>{r.numeroPedido}</td>
                    <td>{r.clienteNombre}</td>
                    <td>{formatearFecha(r.fechaRemito)}</td>
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
        </>
      )}
    </div>
  );
};

export default RemitoList;
