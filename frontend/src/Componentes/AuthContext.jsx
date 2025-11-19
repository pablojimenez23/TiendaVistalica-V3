import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_URL = "http://localhost:8080/api";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pedidos, setPedidos] = useState([]);

  // Cargar usuario al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuarioActivo');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      cargarPedidosUsuario(user.id);
    }
    setCargando(false);
  }, []);

  // Cargar pedidos del usuario desde el backend
  const cargarPedidosUsuario = async (usuarioId) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/usuario/${usuarioId}`);
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuarioActivo', JSON.stringify(datosUsuario));
    cargarPedidosUsuario(datosUsuario.id);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setPedidos([]);
    localStorage.removeItem('usuarioActivo');
  };

  const estaAutenticado = () => {
    return usuario !== null;
  };

  // Crear nuevo pedido en el backend
  const agregarPedido = async (carrito, total) => {
    if (!usuario) return null;

    try {
      const nuevoPedido = {
        usuario: { id: usuario.id },
        total: total,
        estado: "PENDIENTE",
        direccionEnvio: "Dirección por definir",
        metodoPago: "Por definir"
      };

      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPedido)
      });

      if (response.ok) {
        const pedidoCreado = await response.json();
        await cargarPedidosUsuario(usuario.id);
        return pedidoCreado;
      }
    } catch (error) {
      console.error("Error al crear pedido:", error);
      return null;
    }
  };

  // Obtener pedidos del usuario actual
  const obtenerPedidosUsuario = () => {
    return pedidos;
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      setUsuario, 
      iniciarSesion, 
      cerrarSesion, 
      estaAutenticado,
      cargando,
      pedidos,
      agregarPedido,
      obtenerPedidosUsuario
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);