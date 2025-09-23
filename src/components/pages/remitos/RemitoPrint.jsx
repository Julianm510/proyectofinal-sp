// src/components/remitos/RemitoPrint.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../FireBaseConfig";
import { obtenerProductos } from "../productos/ProductoService";

const RemitoPrint = () => {
  const { id } = useParams();
  const [remito, setRemito] = useState(null);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDoc(doc(db, "remitos", id));
      setRemito(snap.data());
      const snapProd = await obtenerProductos();
      setProductos(snapProd.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, [id]);

  if (!remito) return <p>Cargando...</p>;

  return (
    <div className="container mt-4">
      <h2>Remito {remito.numeroRemito}</h2>
      <p>
        <b>Cliente:</b> {remito.clienteNombre}
      </p>
      <p>
        <b>Fecha:</b> {remito.fechaRemito}
      </p>

      <h4>Productos</h4>
      <ul>
        {remito.productos?.map((p, i) => {
          const prod = productos.find((pr) => pr.id === p.productoId);
          return (
            <li key={i}>
              {prod ? prod.nombre : "Producto eliminado"} — {p.cantidad} x $
              {p.precioUnitario}
            </li>
          );
        })}
      </ul>

      <button onClick={() => window.print()} className="btn btn-warning mt-3">
        Imprimir
      </button>
    </div>
  );
};

export default RemitoPrint;
