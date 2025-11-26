import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../Css/Estilo.css";

const API_URL = import.meta.env.VITE_API_URL || "http://54.87.26.211:8080/api";

const Registro = () => {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    genero: '',
    email: '',
    telefono: '',
    password: '',
    passwordConfirm: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validarNombre = (value) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (value.trim() === '') {
      return 'El nombre es obligatorio.';
    } else if (!regex.test(value.trim())) {
      return 'El nombre solo puede contener letras y espacios.';
    } else if (value.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres.';
    }
    return '';
  };

  const validarApellido = (value) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (value.trim() === '') {
      return 'El apellido es obligatorio.';
    } else if (!regex.test(value.trim())) {
      return 'El apellido solo puede contener letras y espacios.';
    } else if (value.trim().length < 2) {
      return 'El apellido debe tener al menos 2 caracteres.';
    }
    return '';
  };

  const validarGenero = (value) => {
    if (value === '' || value === null) {
      return 'Por favor, selecciona un género.';
    }
    return '';
  };

  const validarEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === '') {
      return 'El correo es obligatorio.';
    } else if (!regex.test(value.trim())) {
      return 'El correo no es válido.';
    }
    return '';
  };

  const validarTelefono = (value) => {
    const cleanValue = value.replace(/\s/g, '');
    if (cleanValue === '') {
      return 'El teléfono es obligatorio.';
    } else if (!/^\+?56\d{9}$/.test(cleanValue)) {
      return 'Formato: +56912345678 (9 dígitos después de +56).';
    }
    return '';
  };

  const validarPassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (value.trim() === '') {
      return 'La contraseña es obligatoria.';
    } else if (!regex.test(value.trim())) {
      return 'Debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.';
    }
    return '';
  };

  const validarPasswordConfirm = (password, confirmPassword) => {
    if (confirmPassword.trim() === '') {
      return 'Debe confirmar la contraseña.';
    } else if (password.trim() !== confirmPassword.trim()) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let error = '';
    switch (name) {
      case 'nombre':
        error = validarNombre(value);
        break;
      case 'apellido':
        error = validarApellido(value);
        break;
      case 'genero':
        error = validarGenero(value);
        break;
      case 'email':
        error = validarEmail(value);
        break;
      case 'telefono':
        error = validarTelefono(value);
        break;
      case 'password':
        error = validarPassword(value);
        if (formData.passwordConfirm) {
          const confirmError = validarPasswordConfirm(value, formData.passwordConfirm);
          setErrors(prev => ({ ...prev, passwordConfirm: confirmError }));
        }
        break;
      case 'passwordConfirm':
        error = validarPasswordConfirm(formData.password, value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const nombreError = validarNombre(formData.nombre);
    const apellidoError = validarApellido(formData.apellido);
    const generoError = validarGenero(formData.genero);
    const emailError = validarEmail(formData.email);
    const telefonoError = validarTelefono(formData.telefono);
    const passwordError = validarPassword(formData.password);
    const passwordConfirmError = validarPasswordConfirm(formData.password, formData.passwordConfirm);

    setErrors({
      nombre: nombreError,
      apellido: apellidoError,
      genero: generoError,
      email: emailError,
      telefono: telefonoError,
      password: passwordError,
      passwordConfirm: passwordConfirmError
    });

    const formValido = !nombreError && !apellidoError && !generoError && 
                       !emailError && !telefonoError && !passwordError && !passwordConfirmError;

    if (!formValido) return;

    setLoading(true);

    try {
      const nuevoUsuario = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        genero: formData.genero,
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        password: formData.password
      };

      const response = await fetch(`${API_URL}/usuarios/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario)
      });

      if (response.ok) {
        const data = await response.json();
        iniciarSesion(data.usuario, data.token);
        alert('Cuenta registrada correctamente');
        setFormData({
          nombre: '',
          apellido: '',
          genero: '',
          email: '',
          telefono: '',
          password: '',
          passwordConfirm: ''
        });
        navigate('/');
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ 
          ...prev, 
          email: errorData.error || 'Error al registrar usuario' 
        }));
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alert('Error al conectar con el servidor. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="mb-4 text-center">Crear Cuenta</h2>
            <form onSubmit={handleSubmit} noValidate>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="registerNombre" className="form-label">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    id="registerNombre" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={loading}
                    required 
                  />
                  {errors.nombre && (
                    <span className="text-danger small">{errors.nombre}</span>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="registerApellido" className="form-label">
                    Apellido <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                    id="registerApellido" 
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    disabled={loading}
                    required 
                  />
                  {errors.apellido && (
                    <span className="text-danger small">{errors.apellido}</span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="genero" className="form-label">
                  Género <span className="text-danger">*</span>
                </label>
                <select 
                  className={`form-select ${errors.genero ? 'is-invalid' : ''}`}
                  id="genero" 
                  name="genero" 
                  value={formData.genero}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                >
                  <option value="">Selecciona un género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decirlo</option>
                </select>
                {errors.genero && (
                  <span className="text-danger small">{errors.genero}</span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="registerEmail" className="form-label">
                  Correo electrónico <span className="text-danger">*</span>
                </label>
                <input 
                  type="email" 
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="registerEmail" 
                  name="email"
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  required 
                />
                {errors.email && (
                  <span className="text-danger small">{errors.email}</span>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="registerTelefono" className="form-label">
                  Teléfono <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                  id="registerTelefono" 
                  name="telefono"
                  placeholder="+56912345678"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  disabled={loading}
                  required 
                />
                {errors.telefono && (
                  <span className="text-danger small">{errors.telefono}</span>
                )}
                <small className="form-text text-muted">
                  Formato: +56 seguido de 9 dígitos
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label">
                  Contraseña <span className="text-danger">*</span>
                </label>
                <input 
                  type="password" 
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="registerPassword" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  required 
                />
                {errors.password && (
                  <span className="text-danger small">{errors.password}</span>
                )}
                <small className="form-text text-muted">
                  Mínimo 8 caracteres, una mayúscula, una minúscula y un número
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="registerPasswordConfirm" className="form-label">
                  Confirmar contraseña <span className="text-danger">*</span>
                </label>
                <input 
                  type="password" 
                  className={`form-control ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                  id="registerPasswordConfirm" 
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  disabled={loading}
                  required 
                />
                {errors.passwordConfirm && (
                  <span className="text-danger small">{errors.passwordConfirm}</span>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registrando...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>
            
            <div className="text-center mt-3">
              <Link to="/login">¿Ya tienes cuenta? Iniciar sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registro;