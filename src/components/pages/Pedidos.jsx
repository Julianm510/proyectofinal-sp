const Pedidos = () => {
  return (
    <div className="container">
      <h2>Gestión de Pedidos</h2>

      <form>
        <select>
          <option>Seleccionar Cliente</option>
          <option>Juan Pérez</option>
        </select>
        <input type="date" />
        <input type="text" placeholder="Producto" />
        <input type="number" placeholder="Cantidad" />
        <button type="submit">Agregar Pedido</button>
      </form>

      <hr />

      <h3>Lista de Pedidos</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Juan Pérez</td>
            <td>Harina</td>
            <td>10</td>
            <td>2025-07-24</td>
            <td>
              <button>Editar</button> <button>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Pedidos;
