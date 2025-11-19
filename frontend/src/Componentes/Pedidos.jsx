import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Css/Estilo.css";

const Pedidos = () => {
  const { usuario, obtenerPedidosUsuario, cargando } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!cargando && !usuario) {
      navigate('/login');
    }
  }, [usuario, cargando, navigate]);

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando pedidos...</span>
        </div>
      </div>
    );
  }

  if (!usuario) return null;

  const pedidosUsuario = obtenerPedidosUsuario();

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const getEstadoClass = (estado) => {
    const estadoUpper = estado.toUpperCase();
    switch(estadoUpper) {
      case 'PENDIENTE': return 'warning';
      case 'ENVIADO': return 'info';
      case 'ENTREGADO': return 'success';
      case 'CANCELADO': return 'danger';
      default: return 'secondary';
    }
  };

  const getEstadoTexto = (estado) => {
    const estadoUpper = estado.toUpperCase();
    switch(estadoUpper) {
      case 'PENDIENTE': return 'Pendiente';
      case 'ENVIADO': return 'Enviado';
      case 'ENTREGADO': return 'Entregado';
      case 'CANCELADO': return 'Cancelado';
      default: return estado;
    }
  };

  return (
    <section className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Mis Pedidos</h2>

          {pedidosUsuario.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <h3 className="mt-3">No tienes pedidos aún</h3>
              <p className="text-muted">Explora nuestro catálogo y realiza tu primera compra</p>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => navigate('/catalogo')}
              >
                <i className="bi bi-shop me-2"></i>
                Ir al Catálogo
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {pedidosUsuario.map((pedido) => (
                <div key={pedido.id} className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-header bg-light">
                      <div className="row align-items-center">
                        <div className="col-md-3">
                          <strong>Pedido #{pedido.id}</strong>
                        </div>
                        <div className="col-md-5">
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {formatearFecha(pedido.fechaPedido)}
                          </small>
                        </div>
                        <div className="col-md-4 text-md-end">
                          <span className={`badge bg-${getEstadoClass(pedido.estado)}`}>
                            {getEstadoTexto(pedido.estado)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-8">
                          <h6 className="mb-3">Información del pedido:</h6>
                          <p className="mb-2">
                            <strong>Dirección de envío:</strong> {pedido.direccionEnvio}
                          </p>
                          {pedido.metodoPago && (
                            <p className="mb-2">
                              <strong>Método de pago:</strong> {pedido.metodoPago}
                            </p>
                          )}
                        </div>
                        <div className="col-md-4 text-md-end">
                          <h5 className="text-primary mb-0">
                            <strong>Total:</strong> {formatearPrecio(pedido.total)}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Pedidos;