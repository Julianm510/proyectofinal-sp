// src/components/productos/ProductoList.jsx
import { useEffect, useState } from "react";
import {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto,
} from "./ProductoService";
import ProductoForm from "./ProductoForm";

const ProductoList = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditar, setProductoEditar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const cargarProductos = async () => {
    const snapshot = await obtenerProductos();
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProductos(lista);
    setProductosFiltrados(lista);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarProducto = async (producto) => {
    await crearProducto(producto);
    cargarProductos();
  };

  const guardarActualizacion = async (id, producto) => {
    await actualizarProducto(id, producto);
    setProductoEditar(null);
    cargarProductos();
  };

  const borrarProducto = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      await eliminarProducto(id);
      cargarProductos();
    }
  };

  // 🔍 Filtro de búsqueda
  const handleBuscar = (valor) => {
    setBusqueda(valor);
    if (valor.trim() === "") {
      setProductosFiltrados(productos);
    } else {
      const filtrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(valor.toLowerCase())
      );
      setProductosFiltrados(filtrados);
    }
  };

  return (
    <div className="container">
      <h2>Gestión de Productos</h2>

      {/* 🔸 FORMULARIO DE PRODUCTOS */}
      <ProductoForm
        agregarProducto={agregarProducto}
        productoEditar={productoEditar}
        actualizarProducto={guardarActualizacion}
        cancelarEdicion={() => setProductoEditar(null)}
      />

      {/* 🔸 BARRA DE BÚSQUEDA */}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Ingrese nombre del producto..."
          value={busqueda}
          onChange={(e) => handleBuscar(e.target.value)}
          style={{
            width: "60%",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* 🔸 TABLA DE PRODUCTOS */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio Unitario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>${p.precioUnitario.toFixed(2)}</td>
                <td>
                  <button className="edit" onClick={() => setProductoEditar(p)}>
                    Editar
                  </button>
                  <button
                    className="delete"
                    onClick={() => borrarProducto(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "gray" }}>
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoList;
