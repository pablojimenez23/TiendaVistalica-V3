import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CarritoBoton } from "./Carrito";
import "../Css/Estilo.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAuth();

  // funcion para finalizar sesion
  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm sticky-top custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/Imagenes/Logo Vistalica.png" alt="Logo Vistalica" height="40" />
        </Link>
        <button 
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#barraNavegacion"
          aria-controls="barraNavegacion"
          aria-expanded="false"
          aria-label="Mostrar/Ocultar navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="barraNavegacion">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' || location.pathname === '/inicio' ? 'active' : ''}`}
                to="/"
              >
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/catalogo' ? 'active' : ''}`}
                to="/catalogo"
              >
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/historia' ? 'active' : ''}`}
                to="/historia"
              >
                Historia
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/impacto' ? 'active' : ''}`}
                to="/impacto"
              >
                Impacto
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/contacto' ? 'active' : ''}`}
                to="/contacto"
              >
                Contacto
              </Link>
            </li>
          </ul>
          <form className="d-flex align-items-center">
            <input 
              className="form-control me-2"
              placeholder="Buscar productos..."
              aria-label="Buscar"
            />
            <button className="btn btn-outline-success me-2" title="Buscar">
              <i className="bi bi-search"></i>
            </button>
            <CarritoBoton />
            
            {usuario ? (
              <div className="dropdown">
                <button 
                  className="btn btn-outline-dark dropdown-toggle d-flex align-items-center" 
                  type="button" 
                  id="dropdownUsuario" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-person-fill me-1"></i>
                  <span>{usuario.nombre} {usuario.apellido}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUsuario">
                  <li>
                    <span className="dropdown-item-text">
                      <strong>{usuario.nombre} {usuario.apellido}</strong>
                      <br />
                      <small className="text-muted">{usuario.correo}</small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      <i className="bi bi-person me-2"></i>Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/pedidos">
                      <i className="bi bi-box-seam me-2"></i>Mis Pedidos
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleCerrarSesion}>
                      <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-dark me-2" title="Usuario">
                <i className="bi bi-person"></i>
              </Link>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;