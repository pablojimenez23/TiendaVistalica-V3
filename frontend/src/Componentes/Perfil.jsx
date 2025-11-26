import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Css/Estilo.css";

const Perfil = () => {
  const { usuario, cargando } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!cargando && !usuario) {
      navigate("/login");
    }
  }, [usuario, cargando, navigate]);

  if (cargando) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  if (!usuario) return null;

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Mi Perfil
              </h2>
            </div>

            <div className="card-body p-4">
              <div className="mb-4">
                <h4 className="border-bottom pb-2 mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Información Personal
                </h4>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-person me-1"></i>
                      Nombre:
                    </label>
                    <p className="form-control-plaintext">{usuario.nombre}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-person me-1"></i>
                      Apellido:
                    </label>
                    <p className="form-control-plaintext">{usuario.apellido}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-envelope me-1"></i>
                      Email:
                    </label>
                    <p className="form-control-plaintext">{usuario.email}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-id-badge me-1"></i>
                      Género:
                    </label>
                    <p className="form-control-plaintext">{usuario.genero}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <i className="bi bi-shield-check me-1"></i>
                      Rol:
                    </label>
                    <p className="form-control-plaintext">
                      <span className={`badge ${
                        usuario.rol?.nombre === "ADMINISTRADOR" 
                          ? "bg-danger" 
                          : "bg-primary"
                      }`}>
                        {usuario.rol?.nombre || "CLIENTE"}
                      </span>
                    </p>
                  </div>

                  {usuario.telefono && (
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <i className="bi bi-telephone me-1"></i>
                        Teléfono:
                      </label>
                      <p className="form-control-plaintext">{usuario.telefono}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SECCIoN DE ADMINISTRADOR */}
              {usuario.rol?.nombre === "ADMINISTRADOR" && (
                <div className="card mb-3 border-primary">
                  <div className="card-body">
                    <h5 className="card-title mb-4">
                      <i className="bi bi-shield-check me-2"></i>
                      Panel de Administrador
                    </h5>
                    <div className="d-grid gap-3">
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate("/cuentas")}
                      >
                        <i className="bi bi-people-fill me-2"></i>
                        Gestionar Cuentas Registradas
                      </button>
                      <button
                        className="btn btn-success btn-lg"
                        onClick={() => navigate("/productos-admin")}
                      >
                        <i className="bi bi-box-seam me-2"></i>
                        Gestionar Productos
                      </button>
                      <button
                        className="btn btn-warning btn-lg text-dark"
                        onClick={() => navigate("/pedidos-admin")}
                      >
                        <i className="bi bi-cart-check me-2"></i>
                        Gestión de Pedidos
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón para ver pedidos personales (todos los usuarios) */}
              <div className="d-grid gap-2 mt-3">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/pedidos")}
                >
                  <i className="bi bi-box-seam me-2"></i>
                  Mis Pedidos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Perfil;