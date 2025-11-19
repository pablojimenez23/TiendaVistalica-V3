import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Css/Estilo.css";

const API_URL = "http://localhost:8080/api";

const Login = () => {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validarEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === '') {
      return 'El correo es obligatorio.';
    } else if (!regex.test(value.trim())) {
      return 'El correo no es válido.';
    }
    return '';
  };

  const validarPassword = (value) => {
    if (value.trim() === '') {
      return 'La contraseña es obligatoria.';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'email') {
      error = validarEmail(value);
    } else if (name === 'password') {
      error = validarPassword(value);
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validarEmail(formData.email);
    const passwordError = validarPassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    if (emailError || passwordError) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const usuario = await response.json();
        iniciarSesion(usuario);
        alert(`Bienvenido ${usuario.nombre} ${usuario.apellido}`);
        setFormData({ email: '', password: '' });
        navigate('/');
      } else {
        const errorText = await response.text();
        setErrors({
          email: '',
          password: errorText || 'Correo o contraseña incorrectos.'
        });
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrors({
        email: '',
        password: 'Error al conectar con el servidor. Intenta nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <h2 className="mb-4 text-center">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">
                  Correo electrónico
                </label>
                <input 
                  type="email" 
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="loginEmail" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  required 
                />
                {errors.email && (
                  <span className="text-danger">{errors.email}</span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">
                  Contraseña
                </label>
                <input 
                  type="password" 
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="loginPassword" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  required 
                />
                {errors.password && (
                  <span className="text-danger">{errors.password}</span>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>
            </form>
            
            <div className="text-center mt-3">
              <Link to="/registro">¿No tienes una cuenta? Regístrate aquí</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;