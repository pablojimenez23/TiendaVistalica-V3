import React from "react";
import "../Css/Estilo.css";

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4 text-center text-md-start">
            <h5 className="footer-title mb-3">Síguenos</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="#" className="social-icon" title="Instagram">
                <i className="bi bi-instagram fs-3"></i>
              </a>
              <a href="#" className="social-icon" title="Twitter">
                <i className="bi bi-twitter fs-3"></i>
              </a>
              <a href="#" className="social-icon" title="Facebook">
                <i className="bi bi-facebook fs-3"></i>
              </a>
            </div>
          </div>
          
          <div className="col-md-1 d-none d-md-block">
            <div className="vertical-separator mx-auto"></div>
          </div>
          
          <div className="col-md-4 mb-4 text-center text-md-start">
            <h5 className="footer-title mb-3">Enlaces útiles</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="/politicas">Política de privacidad</a></li>
              <li><a href="/cookies">Política de cookies</a></li>
              <li><a href="/envio">Política de envío</a></li>
              <li><a href="/terminos">Términos y condiciones</a></li>
            </ul>
          </div>
          
          <div className="col-md-1 d-none d-md-block">
            <div className="vertical-separator mx-auto"></div>
          </div>
          
          <div className="col-md-2 mb-4 text-center text-md-start">
            <h5 className="footer-title mb-3">Contacto</h5>
            <p>Email: <strong>contacto@vistalica.cl</strong></p>
            <p><strong>ventas@vistalica.cl</strong></p>
            <p>Teléfono:</p>
            <p><strong>+56 9 1234 5678</strong></p>
          </div>
        </div>
        
        <hr className="footer-separator mt-4" />
        <div className="text-center mt-3">
          <p className="mb-0">2025 Vistalica — Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;