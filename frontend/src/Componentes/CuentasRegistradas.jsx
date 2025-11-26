import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Css/CuentasRegistradas.css";

const CuentasRegistradas = () => {
  const { usuario, token } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://54.87.26.211:8080/api";

  useEffect(() => {
    // Verificar que sea administrador
    if (!usuario || usuario.rol?.nombre !== "ADMINISTRADOR") {
      navigate("/perfil");
      return;
    }

    cargarDatos();
  }, [usuario, navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar usuarios
      const resUsuarios = await fetch(`${API_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (resUsuarios.ok) {
        const dataUsuarios = await resUsuarios.json();
        setUsuarios(dataUsuarios);
      }

      // Cargar roles
      const resRoles = await fetch(`${API_URL}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (resRoles.ok) {
        const dataRoles = await resRoles.json();
        setRoles(dataRoles);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditarRol = (usuarioId, rolActualId) => {
    setEditando(usuarioId);
    setRolSeleccionado(rolActualId);
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setRolSeleccionado(null);
  };

  const handleGuardarRol = async (usuarioId) => {
    if (!rolSeleccionado) {
      alert("Selecciona un rol");
      return;
    }

    try {
      const usuarioActual = usuarios.find(u => u.id === usuarioId);
      
      const response = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...usuarioActual,
          rol: { id: rolSeleccionado }
        })
      });

      if (response.ok) {
        alert("Rol actualizado correctamente");
        setEditando(null);
        setRolSeleccionado(null);
        cargarDatos();
      } else {
        alert("Error al actualizar el rol");
      }
    } catch (error) {
      console.error("Error al actualizar rol:", error);
      alert("Error al conectar con el servidor");
    }
  };

  const handleEliminarCuenta = async (usuarioId, nombre) => {
    if (usuarioId === usuario.id) {
      alert("No puedes eliminar tu propia cuenta");
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar la cuenta de ${nombre}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Cuenta eliminada correctamente");
        cargarDatos();
      } else {
        alert("Error al eliminar la cuenta");
      }
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      alert("Error al conectar con el servidor");
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

  if (loading) {
    return (
      <div className="cuentas-container">
        <div className="container loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cuentas-container">
      <div className="container py-5">
        <div className="cuentas-header">
          <h2>
            <i className="bi bi-people-fill me-2"></i>
            Cuentas Registradas
          </h2>
          <button 
            className="btn btn-outline-secondary btn-volver"
            onClick={() => navigate("/perfil")}
          >
            <i className="bi bi-arrow-left"></i>
            Volver al Perfil
          </button>
        </div>

        <div className="card cuentas-card">
          <div className="card-body">
            <div className="total-usuarios">
              <p className="mb-0">
                Total de usuarios registrados: <strong>{usuarios.length}</strong>
              </p>
            </div>

            <div className="table-responsive">
              <table className="table tabla-cuentas align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Género</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>
                        <strong className="usuario-nombre">{u.nombre} {u.apellido}</strong>
                      </td>
                      <td className="usuario-email">
                        <i className="bi bi-envelope me-2"></i>
                        {u.email}
                      </td>
                      <td>
                        <span className="text-capitalize">{u.genero}</span>
                      </td>
                      <td>
                        {u.telefono || (
                          <span className="text-muted">Sin teléfono</span>
                        )}
                      </td>
                      <td>
                        {editando === u.id ? (
                          <select
                            className="form-select select-rol"
                            value={rolSeleccionado || ''}
                            onChange={(e) => setRolSeleccionado(parseInt(e.target.value))}
                          >
                            <option value="">Seleccionar...</option>
                            {roles.map((rol) => (
                              <option key={rol.id} value={rol.id}>
                                {rol.nombre}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`badge badge-rol ${
                            u.rol?.nombre === 'ADMINISTRADOR' 
                              ? 'badge-administrador' 
                              : 'badge-cliente'
                          }`}>
                            {u.rol?.nombre || 'Sin rol'}
                          </span>
                        )}
                      </td>
                      <td>
                        <small className="fecha-registro">{formatearFecha(u.fechaRegistro)}</small>
                      </td>
                      <td>
                        {editando === u.id ? (
                          <div className="btn-acciones">
                            <button
                              className="btn btn-guardar-rol"
                              onClick={() => handleGuardarRol(u.id)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button
                              className="btn btn-cancelar-edicion"
                              onClick={handleCancelarEdicion}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        ) : (
                          <div className="btn-acciones">
                            <button
                              className="btn btn-editar-rol"
                              onClick={() => handleEditarRol(u.id, u.rol?.id)}
                              title="Cambiar rol"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-eliminar-cuenta"
                              onClick={() => handleEliminarCuenta(u.id, `${u.nombre} ${u.apellido}`)}
                              disabled={u.id === usuario.id}
                              title={u.id === usuario.id ? "No puedes eliminar tu propia cuenta" : "Eliminar cuenta"}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {usuarios.length === 0 && (
              <div className="sin-datos">
                <i className="bi bi-people display-1"></i>
                <p>No hay usuarios registrados</p>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="row estadisticas-row g-4">
          <div className="col-md-4">
            <div className="card estadistica-card estadistica-total">
              <div className="card-body text-center">
                <h5>Total Usuarios</h5>
                <p className="estadistica-numero">{usuarios.length}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card estadistica-card estadistica-admin">
              <div className="card-body text-center">
                <h5>Administradores</h5>
                <p className="estadistica-numero">
                  {usuarios.filter(u => u.rol?.nombre === 'ADMINISTRADOR').length}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card estadistica-card estadistica-clientes">
              <div className="card-body text-center">
                <h5>Clientes</h5>
                <p className="estadistica-numero">
                  {usuarios.filter(u => u.rol?.nombre === 'CLIENTE').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuentasRegistradas;