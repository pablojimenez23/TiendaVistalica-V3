import React from "react";
import "../Css/Estilo.css";

const MisionVisionValores = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Misión, Visión y Valores</h2>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="/Imagenes/Imagen Vision.jpg" 
                className="card-img-top" 
                alt="Imagen Misión" 
              />
              <div className="card-body text-center">
                <h5 className="card-title">Misión</h5>
                <p className="card-text text-muted">
                  Ofrecer moda chilena de calidad, accesible y sustentable, adaptada a las tendencias actuales.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="/Imagenes/Imagen Vision.png" 
                className="card-img-top" 
                alt="Imagen Visión" 
              />
              <div className="card-body text-center">
                <h5 className="card-title">Visión</h5>
                <p className="card-text text-muted">
                  Ser reconocidos como referentes de la moda responsable en Latinoamérica.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img 
                src="/Imagenes/Imagen Valores Empresa.jpg" 
                className="card-img-top" 
                alt="Imagen Valores" 
              />
              <div className="card-body text-center">
                <h5 className="card-title">Valores</h5>
                <p className="card-text text-muted">
                  Compromiso, innovación y respeto por el medio ambiente y la comunidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisionVisionValores;