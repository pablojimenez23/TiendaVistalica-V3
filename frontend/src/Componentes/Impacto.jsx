import React from "react";
import "../Css/Estilo.css";
import "../Css/Impacto.css";

const Impacto = () => {
  return (
    <section className="impacto">
      <h2 className="impacto-title">Impacto de Ventas</h2>

      <div className="impacto-banner banner1">
        <img src="/Imagenes/Imagen Impacto1.jpg" alt="Ventas Nacionales" />
        <div className="impacto-banner-text">
          <h3>Ventas Nacionales</h3>
          <p>Los ingresos en el país durante el último año superaron los $5.000.000, con crecimiento constante respecto a años anteriores. Las categorías más vendidas son ropa urbana, accesorios y calzado.</p>
        </div>
      </div>

      <div className="impacto-banner derecha banner2">
        <img src="/Imagenes/Imagen Banner 3.jpg" alt="Distribución por Ciudades" />
        <div className="impacto-banner-text">
          <h3>Distribución por Ciudades</h3>
          <p>Santiago, Providencia y Las Condes destacan como las comunas con mayor volumen de ventas, gracias a estrategias de marketing local efectivas.</p>
        </div>
      </div>

      <div className="impacto-banner banner3">
        <img src="/Imagenes/Imagen Banner Impacto.jpg" alt="Ventas Globales" />
        <div className="impacto-banner-text">
          <h3>Ventas Globales</h3>
          <p>Ingresos internacionales superan los $2.500.000, destacando Argentina, Perú y México como los mercados con mayor demanda de moda chilena.</p>
        </div>
      </div>

      <div className="impacto-banner derecha banner4">
        <img src="/Imagenes/Banner-clientes.jpg" alt="Clientes Satisfechos" />
        <div className="impacto-banner-text">
          <h3>Clientes Satisfechos</h3>
          <p>Más de 20.000 clientes felices este año gracias a atención personalizada, devoluciones ágiles y promociones exclusivas, logrando altos índices de fidelización.</p>
        </div>
      </div>
    </section>
  );
};

export default Impacto;