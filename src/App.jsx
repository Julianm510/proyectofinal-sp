import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import "./app.css";

import Clientes from "./components/pages/Clientes";
import Productos from "./components/pages/Productos";
import Remitos from "./components/pages/Remitos";
import Home from "./components/pages/Home";
import Pedidos from "./components/pages/Pedidos";
import Footer from "./components/layout/Footer";
import ScrollToTopButton from "./components/common/ScrollToTopButton";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/Clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/remitos" element={<Remitos />} />
          <Route path="/pedidos" element={<Pedidos />} />
        </Routes>
      </div>
      <Footer />
      <ScrollToTopButton />
    </BrowserRouter>
  );
}

export default App;
