import React from "react";
import "../Css/Estilo.css";
import "../Css/Historia.css";

const Historia = () => {
  const hitos = [
    {
      año: "1900",
      titulo: "Fundación",
      descripcion: "Vistalica nace en Chile como una pequeña sastrería familiar, dedicada a confeccionar prendas de calidad para la comunidad local.",
      imagen: "/Imagenes/Sastreria.jpg",
      icono: "bi-star-fill"
    },
    {
      año: "1950",
      titulo: "Expansión Nacional",
      descripcion: "Después de cinco décadas, Vistalica se expande a las principales ciudades de Chile, consolidándose como referente de moda nacional.",
      imagen: "/Imagenes/Expansion.jpg",
      icono: "bi-globe"
    },
    {
      año: "1980",
      titulo: "Innovación Textil",
      descripcion: "Incorporación de nuevas tecnologías textiles y procesos de producción sostenible, marcando un hito en la industria chilena.",
      imagen: "/Imagenes/Imagen Valores Empresa.jpg",
      icono: "bi-lightbulb"
    },
    {
      año: "2000",
      titulo: "Era Digital",
      descripcion: "Vistalica da el salto al comercio electrónico, llevando la moda chilena a todo el mundo a través de su plataforma online.",
      imagen: "/Imagenes/Imagen Banner 3.jpg",
      icono: "bi-laptop"
    },
    {
      año: "2025",
      titulo: "125 Años de Historia",
      descripcion: "Celebramos 125 años de trayectoria, innovación y compromiso con la moda sustentable, manteniéndonos fieles a nuestros valores fundacionales.",
      imagen: "/Imagenes/Imagen Banner Impacto.jpg",
      icono: "bi-trophy-fill"
    }
  ];

  const valores = [
    {
      titulo: "Calidad",
      descripcion: "Compromiso con la excelencia en cada prenda",
      icono: "bi-gem"
    },
    {
      titulo: "Sustentabilidad",
      descripcion: "Respeto por el medio ambiente en todos nuestros procesos",
      icono: "bi-tree"
    },
    {
      titulo: "Innovación",
      descripcion: "Constante evolución y adaptación a nuevas tendencias",
      icono: "bi-lightbulb-fill"
    },
    {
      titulo: "Tradición",
      descripcion: "125 años de experiencia y conocimiento textil",
      icono: "bi-clock-history"
    }
  ];

  return (
    <section className="historia-container">
      <div className="container py-5">
        {/*Header*/}
        <div className="historia-header">
          <h1 className="historia-title">Nuestra Historia</h1>
          <p className="historia-subtitle">
            125 años de moda chilena, innovación y compromiso con la excelencia
          </p>
        </div>

        {/*Introduccion*/}
        <div className="historia-intro">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img 
                src="/Imagenes/Logo Vistalica.png" 
                alt="Logo Vistalica" 
                className="historia-logo"
              />
            </div>
            <div className="col-md-6">
              <h2 className="historia-intro-title">Más de un siglo vistiendo a Chile</h2>
              <p className="historia-intro-text">
                Desde 1900, Vistalica ha sido pionera en la moda chilena. 
                Lo que comenzó como una pequeña sastrería familiar se ha convertido 
                en una marca icónica que combina tradición, calidad e innovación.
              </p>
              <p className="historia-intro-text">
                Hoy, 125 años después, seguimos comprometidos con ofrecer moda 
                sustentable y accesible, manteniendo vivos los valores que nos 
                fundaron mientras miramos hacia el futuro.
              </p>
            </div>
          </div>
        </div>

        {/*Hitos*/}
        <div className="historia-hitos-section">
          <h2 className="section-title">Nuestros Hitos</h2>
          <div className="row g-4">
            {hitos.map((hito, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="hito-card">
                  <div className="hito-imagen-container">
                    <img 
                      src={hito.imagen} 
                      alt={hito.titulo}
                      className="hito-imagen"
                    />
                    <div className="hito-icono-overlay">
                      <i className={`bi ${hito.icono}`}></i>
                    </div>
                  </div>
                  <div className="hito-content">
                    <div className="hito-año">{hito.año}</div>
                    <h3 className="hito-titulo">{hito.titulo}</h3>
                    <p className="hito-descripcion">{hito.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*Valores*/}
        <div className="historia-valores-section">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="row g-4">
            {valores.map((valor, index) => (
              <div key={index} className="col-md-3 col-sm-6">
                <div className="valor-card">
                  <div className="valor-icono">
                    <i className={`bi ${valor.icono}`}></i>
                  </div>
                  <h4 className="valor-titulo">{valor.titulo}</h4>
                  <p className="valor-descripcion">{valor.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Historia;