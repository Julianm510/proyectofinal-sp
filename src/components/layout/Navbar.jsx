import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            viewBox="0 0 512 512"
            fill="#f39c12"
            style={{ verticalAlign: "middle", marginRight: 8 }}
          >
            <path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm0 336a128 128 0 1 1 0-256 128 128 0 0 1 0 256z" />
          </svg>
          Tecno<span>Cut</span>
        </Link>
      </div>

      <div className={`menu-toggle ${open ? "open" : ""}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <ul className={`navbar-links ${open ? "open" : ""}`}>
        <li>
          <Link to="/home" onClick={() => setOpen(false)}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/clientes" onClick={() => setOpen(false)}>
            Clientes
          </Link>
        </li>
        <li>
          <Link to="/productos" onClick={() => setOpen(false)}>
            Productos
          </Link>
        </li>
        <li>
          <Link to="/remitos" onClick={() => setOpen(false)}>
            Remitos
          </Link>
        </li>
        <li>
          <Link to="/pedidos" onClick={() => setOpen(false)}>
            Pedidos
          </Link>
        </li>
        <li>
          <Link to="/localidades" onClick={() => setOpen(false)}>
            Localidades
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
