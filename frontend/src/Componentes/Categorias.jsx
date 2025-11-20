import React, { useState, useEffect } from "react";
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../Css/Estilo.css";

const API_URL = "http://localhost:8080/api";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar categorías desde el backend
  useEffect(() => {
    const cargarCategorias = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/categorias/activas`);
        if (response.ok) {
          const data = await response.json();
          setCategorias(data);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCategorias();
  }, []);

  const agruparCategorias = (cats, tamañoGrupo = 3) => {
    const grupos = [];
    for (let i = 0; i < cats.length; i += tamañoGrupo) {
      grupos.push(cats.slice(i, i + tamañoGrupo));
    }
    return grupos;
  };

  const gruposCategorias = agruparCategorias(categorias);

  const handleClickCategoria = (categoriaId) => {
    navigate(`/catalogo?categoria=${categoriaId}`);
  };

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando categorías...</span>
          </div>
        </div>
      </section>
    );
  }

  if (categorias.length === 0) {
    return (
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Categorías de Productos</h2>
          <p className="text-center text-muted">No hay categorías disponibles</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Categorías de Productos</h2>
        <Carousel 
          id="carouselCategorias" 
          interval={3000} 
          controls={gruposCategorias.length > 1} 
          indicators={gruposCategorias.length > 1}
        >
          {gruposCategorias.map((grupo, index) => (
            <Carousel.Item key={index}>
              <div className="row justify-content-center">
                {grupo.map((categoria) => (
                  <div 
                    key={categoria.id}
                    className="col-12 col-md-4 d-flex justify-content-center mb-4 mb-md-0"
                  >
                    <div 
                      className="card categoria-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleClickCategoria(categoria.id)}
                    >
                      <img 
                        src={categoria.imagenUrl} 
                        className="card-img-top" 
                        alt={categoria.nombre}
                        style={{ 
                          height: '250px', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          e.target.src = '/Imagenes/placeholder-categoria.jpg';
                        }}
                      />
                      <div className="card-body text-center">
                        <h5>{categoria.nombre}</h5>
                        {categoria.descripcion && (
                          <p className="text-muted small">
                            {categoria.descripcion.substring(0, 60)}
                            {categoria.descripcion.length > 60 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Categorias;