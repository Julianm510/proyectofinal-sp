const Productos = () => {
  return (
    <div className="container">
      <h2>Gestión de Productos</h2>

      <form>
        <input type="text" placeholder="Nombre del producto" />
        <input type="number" placeholder="Precio unitario" />
        <input type="text" placeholder="Unidad (kg, unid, etc.)" />
        <button type="submit">Agregar Producto</button>
      </form>

      <hr />

      <h3>Lista de Productos</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Unidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Harina</td>
            <td>$250</td>
            <td>kg</td>
            <td>
              <button>Editar</button> <button>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
