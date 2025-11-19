import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "./Carrito";
import "../Css/Estilo Catalogo.css";

const API_URL = "http://localhost:8080/api";

const Catalogo = () => {
  const navigate = useNavigate();
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { agregarProducto } = useCarrito();

  // Cargar categorías desde el backend
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await fetch(`${API_URL}/categorias/activas`);
        if (response.ok) {
          const data = await response.json();
          setCategorias(data);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    cargarCategorias();
  }, []);

  // Cargar productos desde el backend
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/productos`;
        
        if (categoriaActiva !== 'todos') {
          url = `${API_URL}/productos/categoria/${categoriaActiva}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProductos(data);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, [categoriaActiva]);

  const handleFiltro = (categoriaId) => {
    setCategoriaActiva(categoriaId);
  };

  const handleVerDetalle = (producto) => {
    navigate(`/producto/${producto.id}`);
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const ProductCard = ({ producto }) => {
    const hayStock = producto.stock > 0;
    
    return (
      <div className="col-md-4" key={producto.id}>
        <div className="card" style={{ cursor: 'pointer' }}>
          <div onClick={() => handleVerDetalle(producto)}>
            <img 
              src={producto.imagenUrl} 
              className="card-img-top" 
              alt={producto.nombre}
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">{producto.nombre}</h5>
              <p className="card-text">{formatearPrecio(producto.precio)}</p>
              {producto.esTemporada && (
                <span className="badge bg-warning text-dark mb-2">
                  <i className="bi bi-star-fill me-1"></i>
                  Temporada
                </span>
              )}
            </div>
          </div>
          <div className="card-body text-center" style={{ paddingTop: 0 }}>
            <button 
              className={`btn ${hayStock ? 'btn-primary' : 'btn-sin-stock'}`}
              disabled={!hayStock}
              onClick={(e) => {
                e.stopPropagation();
                if (hayStock) {
                  agregarProducto(producto);
                  alert('Producto agregado al carrito');
                }
              }}
            >
              {hayStock ? 'Agregar al carrito' : 'Sin stock'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="container py-5 catalogo">
      <h2 className="section-title text-center">Catálogo de Productos</h2>
      <p className="catalogo-intro text-center">
        Explora nuestra selección de productos pensados para acompañar tu estilo en cada ocasión.
      </p>

      {/* Filtro categorías */}
      <div className="text-center mb-4">
        <button 
          className={`btn btn-outline-primary filtro-btn ${categoriaActiva === 'todos' ? 'active' : ''}`}
          onClick={() => handleFiltro('todos')}
        >
          Todos
        </button>
        {categorias.map((categoria) => (
          <button 
            key={categoria.id}
            className={`btn btn-outline-primary filtro-btn ${categoriaActiva === categoria.id ? 'active' : ''}`}
            onClick={() => handleFiltro(categoria.id)}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>

      {/* Productos */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando productos...</span>
          </div>
          <p className="mt-3">Cargando productos...</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>

          {/* Mensaje cuando no hay productos */}
          {productos.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">No hay productos disponibles en esta categoría.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Catalogo;