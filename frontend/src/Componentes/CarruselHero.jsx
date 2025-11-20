import React from "react";
import { Carousel } from 'react-bootstrap';
import "../Css/Estilo.css";

const CarruselHero = () => {
  return (
    <Carousel id="carruselPrincipal" interval={5000} ride="carousel">
      <Carousel.Item>
        <img 
          src="/Imagenes/IMGBanner1.jpg" 
          className="d-block w-100 hero-img" 
          alt="Imagen Portada 1" 
        />
        <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center">
          <h1 className="fw-bold">Bienvenido a Vistalica</h1>
          <p className="lead">Moda chilena con 125 años de historia, reinventada para el presente.</p>
          <a href="/catalogo" className="btn btn-primary btn-lg mt-3">
            <i className="bi bi-shop me-2"></i> Ver catálogo
          </a>
        </Carousel.Caption>
      </Carousel.Item>
      
      <Carousel.Item>
        <img 
          src="/Imagenes/IMGBanner2.jpg" 
          className="d-block w-100 hero-img" 
          alt="Imagen Portada 2" 
        />
        <Carousel.Caption className="d-flex align-items-center justify-content-center">
          <h2 className="fw-bold">Viste moderno, vive sin límites</h2>
        </Carousel.Caption>
      </Carousel.Item>
      
      <Carousel.Item>
        <img 
          src="/Imagenes/IMGBanner3.jpg" 
          className="d-block w-100 hero-img" 
          alt="Imagen Portada 3" 
        />
        <Carousel.Caption className="d-flex flex-column align-items-center justify-content-center">
          <h1 className="fw-bold">Impacto de Nuestras Ventas</h1>
          <p className="lead">Nuestras ventas no solo reflejan crecimiento, reflejan confianza, innovación y valor compartido con cada cliente.</p>
          <a href="/impacto" className="btn btn-primary btn-lg mt-3">
            <i className="bi bi-graph-up-arrow me-2"></i> Ver impacto
          </a>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default CarruselHero;