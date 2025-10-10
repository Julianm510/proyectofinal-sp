import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Bienvenido a TecnoCut</h1>
        <p></p>
      </section>

      <section className="features">
        <div className="feature-card">
          <Link to="/productos">
            <h2>📦 Gestión de Productos</h2>
          </Link>

          <p>Cargue y mantenga su stock actualizado fácilmente.</p>
        </div>
        <div className="feature-card">
          <Link to="/Remitos">
            <h2>🧾 Listado de Remitos</h2>
          </Link>

          <p>Genere remitos personalizados con control de numeración.</p>
        </div>
        <div className="feature-card">
          <Link to="/Clientes">
            <h2>👥 Clientes</h2>
          </Link>

          <p>Organice sus contactos por zonas para mayor eficiencia.</p>
        </div>
      </section>

      <section className="about">
        <h2>Sobre TecnoCut</h2>
        <p>
          En <strong>TecnoCut</strong> nos especializamos en la Creación de
          piezas a medida o reparación de distintos tipos de piezas. Contamos
          con una cartera de clientes de la rama metalúrgica y del agro.
        </p>
        <p>
          Nuestro compromiso es brindarte el mejor servicio para ayudarte a
          ahorrar tiempo y reducir errores, ofreciendo productos de primera
          calidad, confiables y pensados para acompañar tu crecimiento.
        </p>
      </section>
    </div>
  );
};

export default Home;
