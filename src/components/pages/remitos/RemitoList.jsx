// src/components/remitos/RemitoList.jsx
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
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

  const eliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este remito?")) {
      await eliminarRemito(id);
      await cargarDatos();
    }
  };

  return (
    <div className="container">
      <h2>Gestión de Remitos</h2>

      <RemitoForm
        pedido={pedido}
        cliente={cliente}
        onSave={cargarDatos}
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
              <td colSpan="7">No hay remitos registrados</td>
            </tr>
          ) : (
            remitos.map((r) => (
              <tr key={r.id}>
                <td>{r.numeroRemito}</td>
                <td>{r.numeroPedido}</td>
                <td>{r.clienteNombre}</td>
                <td>{r.fechaRemito}</td>

                <td>
                  <ul>
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
                  <button className="delete" onClick={() => eliminar(r.id)}>
                    Eliminar
                  </button>
                  <Link to={`/remitos/${r.id}`}>
                    <button className="edit">Ver</button>
                  </Link>
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
