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

  const cargarProductos = async () => {
    const snapshot = await obtenerProductos();
    setProductos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
    await eliminarProducto(id);
    cargarProductos();
  };

  return (
    <div className="container">
      <h2>Gestión de Productos</h2>
      <ProductoForm
        agregarProducto={agregarProducto}
        productoEditar={productoEditar}
        actualizarProducto={guardarActualizacion}
        cancelarEdicion={() => setProductoEditar(null)}
      />
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
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>${p.precioUnitario.toFixed(2)}</td>
              <td>
                <button className="edit" onClick={() => setProductoEditar(p)}>
                  Editar
                </button>
                <button className="delete" onClick={() => borrarProducto(p.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoList;
