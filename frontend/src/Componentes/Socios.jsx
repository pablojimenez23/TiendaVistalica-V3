import React from "react";
import "../Css/Estilo.css";

const Brands = () => {
  return (
    <div className="brands">
      <h2 className="brands-title">Nuestros Socios</h2>
      <div className="brands-logos">
        <a 
          href="https://www.louisvuitton.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="brand-circle" 
          title="Louis Vuitton"
        >
          <img src="/Imagenes/Logo Luis Vuitton.png" alt="Louis Vuitton" />
        </a>
        <a 
          href="https://www.gucci.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="brand-circle" 
          title="Gucci"
        >
          <img src="/Imagenes/Logo Gucci.png" alt="Gucci" />
        </a>
        <a 
          href="https://www.armani.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="brand-circle" 
          title="Armani"
        >
          <img src="/Imagenes/Logo Armani.png" alt="Armani" />
        </a>
        <a 
          href="https://www.balenciaga.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="brand-circle" 
          title="Balenciaga"
        >
          <img src="/Imagenes/Balenciaga-Logo.webp" alt="Balenciaga" />
        </a>
        <a 
          href="https://www.prada.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="brand-circle" 
          title="Prada"
        >
          <img src="/Imagenes/Logo Prada.png" alt="Prada" />
        </a>
        <a 
          href="https://www.versace.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="brand-circle" 
          title="Versace"
        >
          <img src="/Imagenes/Logo Versace.png" alt="Versace" />
        </a>
      </div>
    </div>
  );
};

export default Brands;