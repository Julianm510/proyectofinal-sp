import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./FireBaseConfig";

const TestFirebase = () => {
  const [clientes, setClientes] = useState([]);

  const agregarCliente = async () => {
    try {
      await addDoc(collection(db, "clientes"), {
        nombre: "Prueba Usuario",
        cuit_dni: "123456789",
        direccion: "Calle Falsa 123",
      });
      console.log("Cliente agregado");
      cargarClientes();
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };

  const cargarClientes = async () => {
    try {
      const snapshot = await getDocs(collection(db, "clientes"));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClientes(lista);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div>
      <h2>Test Firebase</h2>
      <button onClick={agregarCliente}>Agregar Cliente de Prueba</button>
      <ul>
        {clientes.map((cli) => (
          <li key={cli.id}>
            {cli.nombre} - {cli.cuit_dni} - {cli.direccion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestFirebase;
