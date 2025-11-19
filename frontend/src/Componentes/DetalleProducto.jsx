import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCarrito } from "./Carrito";
import "../Css/Estilo.css";

const API_URL = "http://localhost:8080/api";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);

  // Cargar producto desde el backend
  useEffect(() => {
    const cargarProducto = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/productos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProducto(data);
        } else {
          alert('Producto no encontrado');
          navigate('/catalogo');
        }
      } catch (error) {
        console.error("Error al cargar producto:", error);
        alert('Error al cargar el producto');
        navigate('/catalogo');
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id, navigate]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const handleAgregarCarrito = async () => {
    if (producto.stock > 0 && cantidad <= producto.stock) {
      for (let i = 0; i < cantidad; i++) {
        await agregarProducto(producto);
      }
      alert(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito`);
      setCantidad(1);
    }
  };

  const handleCantidadChange = (tipo) => {
    if (tipo === 'incrementar' && cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    } else if (tipo === 'decrementar' && cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando producto...</span>
        </div>
        <p className="mt-3">Cargando producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <p>Producto no encontrado</p>
      </div>
    );
  }

  const hayStock = producto.stock > 0;

  return (
    <section className="container py-5">
      <button 
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate('/catalogo')}>
        <i className="bi bi-arrow-left me-2"></i>
        Volver al Catálogo
      </button>

      <div className="row">
        {/* Imagen del producto */}
        <div className="col-md-6">
          <div className="card">
            <img 
              src={producto.imagenUrl} 
              className="card-img-top" 
              alt={producto.nombre}
              style={{ height: '500px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-md-6">
          <h1 className="mb-3">{producto.nombre}</h1>
          <h2 className="text-primary mb-4">{formatearPrecio(producto.precio)}</h2>

          {/* Categoría */}
          {producto.categoria && (
            <div className="mb-3">
              <span className="badge bg-secondary fs-6">
                <i className="bi bi-tag me-1"></i>
                {producto.categoria.nombre}
              </span>
            </div>
          )}

          {/* Stock */}
          <div className="mb-4">
            {hayStock ? (
              <span className="badge bg-success fs-6">
                <i className="bi bi-check-circle me-1"></i>
                Disponible ({producto.stock} en stock)
              </span>
            ) : (
              <span className="badge bg-danger fs-6">
                <i className="bi bi-x-circle me-1"></i>
                Sin stock
              </span>
            )}
          </div>

          {/* Etiqueta de temporada */}
          {producto.esTemporada && (
            <div className="mb-3">
              <span className="badge bg-warning text-dark fs-6">
                <i className="bi bi-star-fill me-1"></i>
                Producto de Temporada
              </span>
            </div>
          )}

          {/* Descripción */}
          <div className="mb-4">
            <h5>Descripción</h5>
            <p className="text-muted">{producto.descripcion}</p>
          </div>

          {/* Cantidad */}
          {hayStock && (
            <div className="mb-4">
              <h5>Cantidad</h5>
              <div className="d-flex align-items-center gap-3">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => handleCantidadChange('decrementar')}
                  disabled={cantidad <= 1}>
                  <i className="bi bi-dash"></i>
                </button>
                <span className="fs-5 fw-bold">{cantidad}</span>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => handleCantidadChange('incrementar')}
                  disabled={cantidad >= producto.stock}>
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>
          )}

          {/* Agregar al carrito */}
          <div className="mb-4">
            <button 
              className={`btn ${hayStock ? 'btn-primary' : 'btn-secondary'} w-100 py-3`}
              onClick={handleAgregarCarrito}
              disabled={!hayStock}>
              <i className="bi bi-cart-plus me-2"></i>
              {hayStock ? 'Agregar al Carrito' : 'Sin Stock'}
            </button>
          </div>

          {/* Detalles adicionales */}
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">Detalles del Producto</h5>
              <ul className="list-unstyled mb-0">
                {producto.material && (
                  <li className="mb-2">
                    <i className="bi bi-tag me-2 text-primary"></i>
                    <strong>Material:</strong> {producto.material}
                  </li>
                )}
                {producto.categoria && (
                  <li className="mb-2">
                    <i className="bi bi-info-circle me-2 text-primary"></i>
                    <strong>Categoría:</strong> {producto.categoria.nombre}
                  </li>
                )}
                {producto.cuidados && (
                  <li>
                    <i className="bi bi-droplet me-2 text-primary"></i>
                    <strong>Cuidados:</strong> {producto.cuidados}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetalleProducto;