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
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const snapshot = await obtenerProductos();
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProductos(lista);
    setProductosFiltrados(lista);
  };

  const agregarProducto = async (producto) => {
    await crearProducto(producto);
    await cargarProductos();
  };

  const guardarActualizacion = async (id, producto) => {
    await actualizarProducto(id, producto);
    setProductoEditar(null);
    await cargarProductos();
  };

  const borrarProducto = async (id) => {
    const tienePedidos = await productoTienePedidosPendientes(id);

    if (tienePedidos) {
      Swal.fire({
        icon: "error",
        title: "No se puede eliminar",
        text: "Este producto está asociado a pedidos pendientes.",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

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
  };

  // 🔍 Función de búsqueda
  const handleBuscar = (valor) => {
    setBusqueda(valor);

    const filtrados = productos.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(valor.toLowerCase()) ||
        p.descripcion?.toLowerCase().includes(valor.toLowerCase()) ||
        p.precioUnitario?.toString().toLowerCase().includes(valor.toLowerCase())
    );

    setProductosFiltrados(filtrados);
  };

  // 🔄 Limpiar búsqueda
  const limpiarFiltros = () => {
    setBusqueda("");
    setProductosFiltrados(productos);
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Productos</h2>

      <ProductoForm
        agregarProducto={agregarProducto}
        productoEditar={productoEditar}
        actualizarProducto={guardarActualizacion}
        cancelarEdicion={() => setProductoEditar(null)}
      />

      {/* 🔍 Buscador */}
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
          placeholder="Buscar producto por nombre, descripción o precio..."
          value={busqueda}
          onChange={(e) => handleBuscar(e.target.value)}
          style={{
            width: "45%",
            padding: "10px 14px",
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
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
        >
          Limpiar filtros ✖
        </button>
      </div>

      {/* 🧾 Tabla */}
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
          {productosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#666" }}>
                No se encontraron productos.
              </td>
            </tr>
          ) : (
            productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>${Number(p.precioUnitario).toFixed(2)}</td>
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
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoList;
