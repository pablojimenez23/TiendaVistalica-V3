import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Componentes/Navbar";
import HeroCarousel from "./Componentes/CarruselHero";
import Brands from "./Componentes/Socios";
import MisionVisionValores from "./Componentes/ValoresEmpresa";
import ProductosTemporada from "./Componentes/ProductosTemporada";
import Categorias from "./Componentes/Categorias";
import Boletin from "./Componentes/Boletin";
import Footer from "./Componentes/Footer";
import Catalogo from "./Componentes/Catalogo";
import Historia from "./Componentes/Historia";
import Login from "./Componentes/Login";
import Registro from "./Componentes/Registro";
import Impacto from "./Componentes/Impacto";
import Contacto from "./Componentes/Contacto";
import DetalleProducto from "./Componentes/DetalleProducto";
import Perfil from "./Componentes/Perfil";
import Pedidos from "./Componentes/Pedidos";
import { CarritoProvider } from "./Componentes/Carrito";
import Carrito from "./Componentes/Carrito";
import { AuthProvider } from "./Componentes/AuthContext";

const Home = () => (
  <>
    <HeroCarousel />
    <Brands />
    <MisionVisionValores />
    <ProductosTemporada />
    <Categorias />
    <img 
      src="/Imagenes/Imagen 2 Vistalica.jpg" 
      alt="Imagen decorativa Vistalica" 
      style={{width:'100%', height:'auto'}}
    />
    <Boletin />
  </>
);

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inicio" element={<Home />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/historia" element={<Historia />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/impacto" element={<Impacto />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/pedidos" element={<Pedidos />} />
            </Routes>
            
            <Footer />
            <Carrito />
          </div>
        </Router>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;