import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Css/Estilo.css";

const API_URL = "http://localhost:8080/api";

const ProductosTemporada = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProductosTemporada = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/productos/temporada`);
        if (response.ok) {
          const data = await response.json();
          // Limitar a 3 productos para la vista de inicio
          setProductos(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error al cargar productos de temporada:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductosTemporada();
  }, []);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const calcularPrecioDescuento = (precio) => {
    return precio * 1.3;
  };

  const handleVerDetalle = (productoId) => {
    navigate(`/producto/${productoId}`);
  };

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando ofertas...</span>
          </div>
        </div>
      </section>
    );
  }

  if (productos.length === 0) {
    return (
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Ofertas de temporada</h2>
          <p className="text-center text-muted">
            No hay productos de temporada disponibles en este momento
          </p>
          <div className="text-center mt-4">
            <Link to="/catalogo" className="btn btn-primary">
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Ofertas de temporada</h2>
        <div className="row g-4">
          {productos.map((producto) => (
            <div key={producto.id} className="col-md-4">
              <div 
                className="card h-100 shadow-sm" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleVerDetalle(producto.id)}
              >
                <div className="position-relative">
                  <img 
                    src={producto.imagenUrl} 
                    className="card-img-top" 
                    alt={producto.nombre}
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark">
                    <i className="bi bi-star-fill me-1"></i>
                    Temporada
                  </span>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <p className="card-text text-primary fw-bold mb-0">
                      {formatearPrecio(producto.precio)}
                    </p>
                    <p className="card-text old-price mb-0">
                      {formatearPrecio(calcularPrecioDescuento(producto.precio))}
                    </p>
                  </div>
                  <div className="mt-3">
                    <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <Link to="/catalogo" className="btn btn-primary">
            Ver todas las ofertas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductosTemporada;