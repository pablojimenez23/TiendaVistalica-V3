import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Css/PedidosAdmin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://54.87.26.211:8080/api";

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [modalCancelar, setModalCancelar] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    if (!usuario || usuario.rol?.nombre !== "ADMINISTRADOR") {
      navigate("/perfil");
      return;
    }
    cargarPedidos();
  }, [usuario, navigate]);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pedidos/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        setError("Error al cargar los pedidos");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (pedidoId) => {
    if (!window.confirm("¿Aprobar este pedido?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/aprobar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const actualizado = await response.json();
        setPedidos(pedidos.map(p => p.id === pedidoId ? actualizado : p));
        alert("Pedido aprobado correctamente");
      } else {
        setError("Error al aprobar el pedido");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al aprobar el pedido");
    }
  };

  const abrirModalCancelar = (pedido) => {
    setModalCancelar(pedido);
    setMotivoCancelacion("");
  };

  const cerrarModalCancelar = () => {
    setModalCancelar(null);
    setMotivoCancelacion("");
  };

  const handleCancelar = async () => {
    if (!modalCancelar) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/pedidos/${modalCancelar.id}/cancelar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          motivo: motivoCancelacion || "Sin motivo especificado" 
        })
      });

      if (response.ok) {
        const actualizado = await response.json();
        setPedidos(pedidos.map(p => p.id === modalCancelar.id ? actualizado : p));
        alert("Pedido cancelado correctamente");
        cerrarModalCancelar();
      } else {
        setError("Error al cancelar el pedido");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cancelar el pedido");
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
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

  const getBadgeEstado = (estado) => {
    const badges = {
      'PENDIENTE': 'bg-warning text-dark',
      'APROBADO': 'bg-success',
      'CANCELADO': 'bg-danger',
      'ENVIADO': 'bg-info',
      'ENTREGADO': 'bg-primary'
    };
    return badges[estado] || 'bg-secondary';
  };

  const pedidosFiltrados = filtroEstado === "TODOS" 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="pedidos-admin-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="admin-header">
              <h2>
                <i className="bi bi-cart-check me-2"></i>
                Solicitudes de Pedidos
              </h2>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate("/perfil")}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver al Perfil
              </button>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button className="btn-close" onClick={() => setError(null)}></button>
              </div>
            )}

            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <h5 className="mb-3 mb-md-0">
                      <i className="bi bi-funnel me-2"></i>
                      Filtrar por estado:
                    </h5>
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                      <option value="TODOS">Todos los pedidos</option>
                      <option value="PENDIENTE">Pendientes</option>
                      <option value="APROBADO">Aprobados</option>
                      <option value="CANCELADO">Cancelados</option>
                      <option value="ENVIADO">Enviados</option>
                      <option value="ENTREGADO">Entregados</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {pedidosFiltrados.length === 0 ? (
              <div className="card shadow">
                <div className="card-body text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                  <h5 className="text-muted">No hay pedidos para mostrar</h5>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {pedidosFiltrados.map((pedido) => (
                  <div key={pedido.id} className="col-12">
                    <div className="card shadow pedido-card">
                      <div className="card-header bg-light">
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <strong>Pedido #{pedido.id}</strong>
                          </div>
                          <div className="col-md-3">
                            <small className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              {formatearFecha(pedido.fechaPedido)}
                            </small>
                          </div>
                          <div className="col-md-3">
                            <span className={`badge ${getBadgeEstado(pedido.estado)}`}>
                              {pedido.estado}
                            </span>
                          </div>
                          <div className="col-md-3 text-end">
                            <strong className="text-primary">
                              {formatearPrecio(pedido.total)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <h6 className="text-muted mb-2">
                              <i className="bi bi-person me-2"></i>
                              Cliente:
                            </h6>
                            <p className="mb-1">
                              <strong>{pedido.usuario?.nombre} {pedido.usuario?.apellido}</strong>
                            </p>
                            <p className="mb-0 text-muted small">
                              {pedido.usuario?.email}
                            </p>
                          </div>

                          <div className="col-md-6 mb-3">
                            <h6 className="text-muted mb-2">
                              <i className="bi bi-geo-alt me-2"></i>
                              Dirección de envío:
                            </h6>
                            <p className="mb-0">{pedido.direccionEnvio}</p>
                          </div>

                          {pedido.motivoCancelacion && (
                            <div className="col-12 mb-3">
                              <div className="alert alert-danger mb-0">
                                <strong>
                                  <i className="bi bi-x-circle me-2"></i>
                                  Motivo de cancelación:
                                </strong>
                                <p className="mb-0 mt-2">{pedido.motivoCancelacion}</p>
                              </div>
                            </div>
                          )}

                          <div className="col-12">
                            <h6 className="text-muted mb-2">
                              <i className="bi bi-credit-card me-2"></i>
                              Método de pago:
                            </h6>
                            <p className="mb-0">{pedido.metodoPago || "No especificado"}</p>
                          </div>
                        </div>
                      </div>

                      {pedido.estado === "PENDIENTE" && (
                        <div className="card-footer bg-light">
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-success"
                              onClick={() => handleAprobar(pedido.id)}
                            >
                              <i className="bi bi-check-circle me-2"></i>
                              Aprobar Pedido
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => abrirModalCancelar(pedido)}
                            >
                              <i className="bi bi-x-circle me-2"></i>
                              Cancelar Pedido
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-muted">
              <small>
                <i className="bi bi-info-circle me-2"></i>
                Total de pedidos: {pedidosFiltrados.length}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para cancelar pedido */}
      {modalCancelar && (
        <div className="modal-overlay" onClick={cerrarModalCancelar}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>
                <i className="bi bi-x-circle me-2"></i>
                Cancelar Pedido #{modalCancelar.id}
              </h5>
              <button className="btn-close" onClick={cerrarModalCancelar}></button>
            </div>
            <div className="modal-body">
              <p className="text-muted">
                ¿Estás seguro de que deseas cancelar este pedido?
              </p>
              <div className="mb-3">
                <label className="form-label">
                  Motivo de cancelación (opcional):
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Ej: Producto agotado, error en el pedido, etc..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={cerrarModalCancelar}>
                Cerrar
              </button>
              <button className="btn btn-danger" onClick={handleCancelar}>
                <i className="bi bi-x-circle me-2"></i>
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PedidosAdmin;