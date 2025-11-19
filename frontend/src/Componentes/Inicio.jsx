import React from "react";
import CarruselHero from "./CarruselHero";
import Categorias from "./Categorias";
import ProductosTemporada from "./ProductosTemporada";
import MisionVisionValores from "./MisionVisionValores";
import Brands from "./Brands";
import Boletin from "./Boletin";

const Inicio = () => {
  return (
    <>
      <CarruselHero />
      <Categorias />
      <ProductosTemporada />
      <MisionVisionValores />
      <Brands />
      <Boletin />
    </>
  );
};

export default Inicio;