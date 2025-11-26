import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Css/ProductosAdmin.css";

const API_URL = import.meta.env.VITE_API_URL || "http://54.87.26.211:8080/api";

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    if (!usuario || usuario.rol?.nombre !== "ADMINISTRADOR") {
      navigate("/perfil");
      return;
    }
    cargarDatos();
  }, [usuario, navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [productosRes, categoriasRes] = await Promise.all([
        fetch(`${API_URL}/productos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/categorias`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (productosRes.ok && categoriasRes.ok) {
        const productosData = await productosRes.json();
        const categoriasData = await categoriasRes.json();
        setProductos(productosData);
        setCategorias(categoriasData);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (producto) => {
    setEditando(producto.id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoriaId: producto.categoria?.id || '',
      esTemporada: producto.esTemporada
    });
  };

  const handleCancelar = () => {
    setEditando(null);
    setFormData({});
  };

  const handleGuardar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const productoOriginal = productos.find(p => p.id === id);
      
      const productoActualizado = {
        ...productoOriginal,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        esTemporada: formData.esTemporada,
        categoria: categorias.find(c => c.id === parseInt(formData.categoriaId))
      };

      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productoActualizado)
      });

      if (response.ok) {
        const actualizado = await response.json();
        setProductos(productos.map(p => p.id === id ? actualizado : p));
        setEditando(null);
        setFormData({});
        alert("Producto actualizado correctamente");
      } else {
        setError("Error al actualizar el producto");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al actualizar el producto");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setProductos(productos.filter(p => p.id !== id));
        alert("Producto eliminado correctamente");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error al eliminar el producto");
    }
  };

  const handleToggleTemporada = async (id, valor) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/productos/${id}/temporada`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ esTemporada: valor })
      });

      if (response.ok) {
        const actualizado = await response.json();
        setProductos(productos.map(p => p.id === id ? actualizado : p));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

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
    <section className="productos-admin-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="admin-header">
              <h2>
                <i className="bi bi-box-seam me-2"></i>
                Gestión de Productos
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
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                ></button>
              </div>
            )}

            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="search-box">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, descripción o categoría..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="card shadow">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover productos-table">
                    <thead className="table-primary">
                      <tr>
                        <th width="5%">ID</th>
                        <th width="25%">Nombre</th>
                        <th width="15%">Precio</th>
                        <th width="10%">Stock</th>
                        <th width="15%">Categoría</th>
                        <th width="10%">Temporada</th>
                        <th width="20%">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center text-muted">
                            No se encontraron productos
                          </td>
                        </tr>
                      ) : (
                        productosFiltrados.map((p) => (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            
                            {/* Nombre */}
                            <td>
                              {editando === p.id ? (
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={formData.nombre}
                                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                />
                              ) : (
                                <span className="producto-nombre">{p.nombre}</span>
                              )}
                            </td>
                            
                            {/* Precio */}
                            <td>
                              {editando === p.id ? (
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={formData.precio}
                                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                                  min="0"
                                  step="100"
                                />
                              ) : (
                                <span className="producto-precio">{formatearPrecio(p.precio)}</span>
                              )}
                            </td>
                            
                            {/* Stock */}
                            <td>
                              {editando === p.id ? (
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={formData.stock}
                                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                  min="0"
                                />
                              ) : (
                                <span className={`badge ${p.stock > 10 ? 'bg-success' : p.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                  {p.stock} unidades
                                </span>
                              )}
                            </td>
                            
                            {/* Categoría */}
                            <td>
                              {editando === p.id ? (
                                <select
                                  className="form-select form-select-sm"
                                  value={formData.categoriaId}
                                  onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
                                >
                                  <option value="">Seleccionar...</option>
                                  {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.nombre}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="badge bg-info">
                                  {p.categoria?.nombre || 'Sin categoría'}
                                </span>
                              )}
                            </td>
                            
                            {/* Temporada */}
                            <td>
                              {editando === p.id ? (
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.esTemporada}
                                    onChange={(e) => setFormData({...formData, esTemporada: e.target.checked})}
                                  />
                                </div>
                              ) : (
                                <div className="form-check form-switch">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={p.esTemporada}
                                    onChange={(e) => handleToggleTemporada(p.id, e.target.checked)}
                                  />
                                </div>
                              )}
                            </td>
                            
                            {/* Acciones */}
                            <td>
                              {editando === p.id ? (
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-success"
                                    onClick={() => handleGuardar(p.id)}
                                    title="Guardar"
                                  >
                                    <i className="bi bi-check-lg"></i>
                                  </button>
                                  <button
                                    className="btn btn-secondary"
                                    onClick={handleCancelar}
                                    title="Cancelar"
                                  >
                                    <i className="bi bi-x-lg"></i>
                                  </button>
                                </div>
                              ) : (
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => handleEditar(p)}
                                    title="Editar"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleEliminar(p.id)}
                                    title="Eliminar"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 text-muted">
                  <small>
                    <i className="bi bi-info-circle me-2"></i>
                    Total de productos: {productosFiltrados.length}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductosAdmin;