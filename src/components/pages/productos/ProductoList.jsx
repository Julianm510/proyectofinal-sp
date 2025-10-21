import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto,
} from "./ProductoService";
import ProductoForm from "./ProductoForm";
import { productoTienePedidosPendientes } from "../../ValidacionesService";

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
    const tienePedidos = await productoTienePedidosPendientes(id);

    if (tienePedidos) {
      Swal.fire({
        icon: "error",
        title: "No se puede eliminar",
        text: "Este producto pertenece a pedidos pendientes.",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarProducto(id);
        await cargarProductos();
        Swal.fire({
          icon: "success",
          title: "Producto eliminado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
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
