// src/components/productos/ProductoForm.jsx
import { useState, useEffect } from "react";

const ProductoForm = ({
  agregarProducto,
  productoEditar,
  actualizarProducto,
  cancelarEdicion,
}) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precioUnitario: "",
  });

  useEffect(() => {
    if (productoEditar) setForm(productoEditar);
  }, [productoEditar]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const producto = {
      ...form,
      precioUnitario: parseFloat(form.precioUnitario),
    };
    if (productoEditar) actualizarProducto(productoEditar.id, producto);
    else agregarProducto(producto);
    setForm({ nombre: "", descripcion: "", precioUnitario: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        placeholder="Nombre del producto"
        value={form.nombre}
        onChange={handleChange}
      />
      <input
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleChange}
      />
      <input
        name="precioUnitario"
        placeholder="Precio unitario"
        type="number"
        value={form.precioUnitario}
        onChange={handleChange}
      />
      <button type="submit">
        {productoEditar ? "Actualizar" : "Agregar Producto"}
      </button>
      {productoEditar && (
        <button type="button" onClick={cancelarEdicion}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default ProductoForm;
