import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/Estilo.css";
import "../Css/Estilo Carrito Compras.css";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext();
const API_URL = "http://localhost:8080/api";

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  // cargar carrito del usuario desde el backend
  useEffect(() => {
    if (usuario) {
      cargarCarrito();
    } else {
      setCarrito([]);
    }
  }, [usuario]);

  const cargarCarrito = async () => {
    if (!usuario) return;

    try {
      const response = await fetch(`${API_URL}/carrito/usuario/${usuario.id}`);
      if (response.ok) {
        const data = await response.json();
        setCarrito(data);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    }
  };

  const agregarProducto = async (producto) => {
    if (!usuario) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (producto.stock <= 0) {
      alert('Producto sin stock');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/carrito/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: usuario.id,
          productoId: producto.id
        })
      });

      if (response.ok) {
        await cargarCarrito();
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      alert('Error al agregar producto al carrito');
    } finally {
      setLoading(false);
    }
  };

  const quitarProducto = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/carrito/item/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await cargarCarrito();
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const actualizarCantidad = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      await quitarProducto(itemId);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/carrito/item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad: nuevaCantidad })
      });

      if (response.ok) {
        await cargarCarrito();
      } else {
        alert('No hay suficiente stock disponible');
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const vaciarCarrito = async () => {
    if (!usuario) return;

    try {
      const response = await fetch(`${API_URL}/carrito/usuario/${usuario.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCarrito([]);
      }
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
    }
  };

  const obtenerTotal = () => {
    return carrito.reduce((total, item) => {
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  };

  const obtenerCantidadTotal = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  const toggleCarrito = () => {
    setIsOpen(!isOpen);
  };

  const value = {
    carrito,
    isOpen,
    agregarProducto,
    quitarProducto,
    actualizarCantidad,
    vaciarCarrito,
    obtenerTotal,
    obtenerCantidadTotal,
    toggleCarrito,
    setIsOpen,
    loading
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
  }
  return context;
};

export const CarritoBoton = () => {
  const { toggleCarrito, obtenerCantidadTotal } = useCarrito();
  const cantidadTotal = obtenerCantidadTotal();

  return (
    <button 
      className="btn btn-outline-dark me-2 btn-carrito" 
      type="button" 
      title="Carrito de compras"
      onClick={toggleCarrito}
    >
      <i className="bi bi-bag"></i>
      {cantidadTotal > 0 && (
        <span className="carrito-badge">{cantidadTotal}</span>
      )}
    </button>
  );
};

const Carrito = () => {
  const {
    carrito,
    isOpen,
    quitarProducto,
    actualizarCantidad,
    vaciarCarrito,
    obtenerTotal,
    setIsOpen
  } = useCarrito();

  const { usuario, agregarPedido } = useAuth();
  const navigate = useNavigate();

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const handleCheckout = async () => {
    if (carrito.length === 0) return;

    if (!usuario) {
      alert('Debes iniciar sesión para poder finalizar tu compra');
      setIsOpen(false);
      navigate('/login');
      return;
    }

    const pedido = await agregarPedido(carrito, obtenerTotal());
    
    if (pedido) {
      alert(`Pedido procesado por ${formatearPrecio(obtenerTotal())}`);
      await vaciarCarrito();
      setIsOpen(false);
      navigate('/pedidos');
    } else {
      alert('Error al procesar el pedido. Intenta nuevamente.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div 
        className={`carrito-overlay ${isOpen ? 'activo' : ''}`}
        onClick={handleOverlayClick}
      />

      <div className={`carrito-panel ${isOpen ? 'activo' : ''}`}>
        <div className="carrito-header">
          <h3 className="carrito-title">Carrito de Compras</h3>
          <button 
            className="carrito-close"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="carrito-contenido">
          {carrito.length === 0 ? (
            <div className="carrito-vacio">
              <i className="bi bi-bag"></i>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="carrito-item">
                <img 
                  src={item.producto.imagenUrl} 
                  alt={item.producto.nombre}
                  className="carrito-item-img"
                />
                
                <div className="carrito-item-info">
                  <p className="carrito-item-nombre">{item.producto.nombre}</p>
                  <p className="carrito-item-precio">{formatearPrecio(item.producto.precio)}</p>
                </div>

                <div className="carrito-item-controles">
                  <div className="cantidad-controles">
                    <button 
                      className="cantidad-btn"
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      -
                    </button>
                    <span className="cantidad-display">{item.cantidad}</span>
                    <button 
                      className="cantidad-btn"
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    className="eliminar-btn"
                    onClick={() => quitarProducto(item.id)}
                    title="Eliminar producto"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {carrito.length > 0 && (
          <div className="carrito-footer">
            <div className="carrito-total">
              <span className="carrito-total-label">Total:</span>
              <span className="carrito-total-precio">
                {formatearPrecio(obtenerTotal())}
              </span>
            </div>
            
            <div className="carrito-acciones">
              <button 
                className="btn btn-vaciar"
                onClick={vaciarCarrito}>
                Vaciar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCheckout}
                style={{flex: 2}}>
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Carrito;