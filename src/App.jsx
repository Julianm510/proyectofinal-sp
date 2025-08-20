import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import "./app.css";

import Clientes from "./components/pages/clientes/Clientes";
import Productos from "./components/pages/productos/Productos";
import Remitos from "./components/pages/remitos/Remitos";
import Home from "./components/pages/home/Home";
import Pedidos from "./components/pages/pedidos/Pedidos";
import Footer from "./components/layout/Footer";
import ScrollToTopButton from "./components/common/ScrollToTopButton";
import TestFirebase from "./TestFireBase";

import DashBoard from "./dashboard/DashBoard";
import RemitoDetalle from "./components/pages/remitos/RemitoDetalle";

<Route path="/remito/:id" element={<RemitoDetalle />} />;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/remitos" element={<Remitos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/remito/:id" element={<RemitoDetalle />} />
        </Routes>
      </div>
      <Footer />
      <ScrollToTopButton />
    </BrowserRouter>
  );
}

export default App;
