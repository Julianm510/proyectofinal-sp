// src/components/Footer.jsx
import "./footer.css";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer fade-in-footer">
      <p>
        © {new Date().getFullYear()} TecnoCut — Todos los derechos reservados
      </p>
      <div className="social-links">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebook />
        </a>
        <a
          href="https://wa.me/549XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
