import { useEffect, useState } from "react";
import Swal from "sweetalert2";
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

  const cargarProductos = async () => {
    const snapshot = await obtenerProductos();
    setProductos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // ✅ Al crear producto
  const agregarProducto = async (producto) => {
    await crearProducto(producto);
    cargarProductos();

    Swal.fire({
      title: "Producto agregado",
      text: "El producto se creó correctamente.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // ✅ Al editar producto
  const guardarActualizacion = async (id, producto) => {
    await actualizarProducto(id, producto);
    setProductoEditar(null);
    cargarProductos();

    Swal.fire({
      title: "Producto actualizado",
      text: "El producto se actualizó correctamente.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // ✅ Confirmación antes de eliminar
  const borrarProducto = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción eliminará el producto de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      await eliminarProducto(id);
      cargarProductos();

      Swal.fire({
        title: "Producto eliminado",
        text: "El producto se eliminó correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Gestión de Productos</h2>

      <ProductoForm
        agregarProducto={agregarProducto}
        productoEditar={productoEditar}
        actualizarProducto={guardarActualizacion}
        cancelarEdicion={() => setProductoEditar(null)}
      />

      <div className="my-3 text-center">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "60%",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
          }}
        />
      </div>

      <table className="table table-striped mt-3">
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
                <td>${p.precioUnitario?.toFixed(2)}</td>
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
              <td colSpan="4" style={{ textAlign: "center", color: "#777" }}>
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
