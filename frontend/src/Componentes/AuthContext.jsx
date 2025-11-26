import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://54.87.26.211:8080/api";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pedidos, setPedidos] = useState([]);

  // Cargar usuario y token al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    const tokenGuardado = localStorage.getItem('token');
    
    if (usuarioGuardado && tokenGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      setToken(tokenGuardado);
      cargarPedidosUsuario(user.id, tokenGuardado);
    }
    setCargando(false);
  }, []);

  // Función auxiliar para hacer peticiones con token
  const fetchConToken = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // Cargar pedidos del usuario
  const cargarPedidosUsuario = async (usuarioId, authToken) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/usuario/${usuarioId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  const iniciarSesion = (datosUsuario, authToken) => {
    setUsuario(datosUsuario);
    setToken(authToken);
    localStorage.setItem('usuarioActivo', JSON.stringify(datosUsuario));
    localStorage.setItem('token', authToken);
    cargarPedidosUsuario(datosUsuario.id, authToken);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setToken(null);
    setPedidos([]);
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('token');
  };

  const estaAutenticado = () => {
    return usuario !== null && token !== null;
  };

  // Verificar si es admin
  const esAdmin = () => {
    return usuario && usuario.rol && usuario.rol.nombre === 'ADMIN';
  };

  // Crear pedido con token
  const agregarPedido = async (carrito, total) => {
    if (!usuario || !token) return null;

    try {
      const nuevoPedido = {
        usuario: { id: usuario.id },
        total: total,
        estado: "PENDIENTE",
        direccionEnvio: "Dirección por definir",
        metodoPago: "Por definir"
      };

      const response = await fetchConToken(`${API_URL}/pedidos`, {
        method: 'POST',
        body: JSON.stringify(nuevoPedido)
      });

      if (response.ok) {
        const pedidoCreado = await response.json();
        await cargarPedidosUsuario(usuario.id, token);
        return pedidoCreado;
      }
    } catch (error) {
      console.error("Error al crear pedido:", error);
      return null;
    }
  };

  const obtenerPedidosUsuario = () => {
    return pedidos;
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      token,
      setUsuario, 
      iniciarSesion, 
      cerrarSesion, 
      estaAutenticado,
      esAdmin,
      cargando,
      pedidos,
      agregarPedido,
      obtenerPedidosUsuario,
      fetchConToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);