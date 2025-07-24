const Remitos = () => {
  return (
    <div className="container">
      <h2>Generar Remito</h2>

      <form>
        <select>
          <option>Seleccionar Cliente</option>
          <option>Juan Pérez</option>
        </select>
        <input type="date" />
        <input type="text" placeholder="Número de Remito" />

        <hr />

        <h4>Agregar productos al remito</h4>
        <input type="text" placeholder="Producto" />
        <input type="number" placeholder="Cantidad" />
        <button type="button">Agregar al remito</button>

        <br />
        <br />
        <button type="submit">Guardar Remito</button>
      </form>

      <hr />

      <h3>Remitos Generados</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>N° Remito</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0001</td>
            <td>Juan Pérez</td>
            <td>2025-07-24</td>
            <td>
              <button>Ver</button> <button>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Remitos;
