import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} TecnoCut - Todos los derechos reservados
      </p>
      <div className="social-links">
        <a
          href="https://facebook.com/tuempresa"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://twitter.com/tuempresa"
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter />
        </a>
        <a
          href="https://linkedin.com/company/tuempresa"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
