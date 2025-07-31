// src/components/pages/Home.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../FireBaseConfig";
import "./dashboard.css";

const Home = () => {
  const [totales, setTotales] = useState({
    clientes: 0,
    productos: 0,
    pedidos: 0,
    remitos: 0,
  });

  const cargarTotales = async () => {
    const [c, p, pe, r] = await Promise.all([
      getDocs(collection(db, "clientes")),
      getDocs(collection(db, "productos")),
      getDocs(collection(db, "pedidos")),
      getDocs(collection(db, "remitos")),
    ]);
    setTotales({
      clientes: c.size,
      productos: p.size,
      pedidos: pe.size,
      remitos: r.size,
    });
  };

  useEffect(() => {
    cargarTotales();
  }, []);

  return (
    <div className="container">
      <h2>Resumen General</h2>
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div className="card-resumen">
          <h3>Clientes</h3>
          <p>{totales.clientes}</p>
        </div>
        <div className="card-resumen">
          <h3>Productos</h3>
          <p>{totales.productos}</p>
        </div>
        <div className="card-resumen">
          <h3>Pedidos</h3>
          <p>{totales.pedidos}</p>
        </div>
        <div className="card-resumen">
          <h3>Remitos</h3>
          <p>{totales.remitos}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
