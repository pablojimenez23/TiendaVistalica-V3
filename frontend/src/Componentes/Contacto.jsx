import React, { useState, useRef } from "react";
import "../Css/Estilo.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    motivo: '',
    mensaje: ''
  });
  
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);

  const mostrarError = (field, mensajeError) => {
    setErrors(prev => ({ ...prev, [field]: mensajeError }));
  };

  const quitarError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const evitarNumeros = (event) => {
    if (event.key >= '0' && event.key <= '9') {
      event.preventDefault();
    }
  };

  const limpiarNumeros = (value) => {
    return value.replace(/[0-9]/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleanValue = value;

    if (name === 'nombre' || name === 'apellido') {
      cleanValue = limpiarNumeros(value);
    }

    setFormData(prev => ({ ...prev, [name]: cleanValue }));

    if (name === 'nombre') {
      cleanValue.trim() !== '' ? quitarError('nombre') : mostrarError('nombre', 'Por favor, ingresa tu nombre.');
    }
    
    if (name === 'apellido') {
      cleanValue.trim() !== '' ? quitarError('apellido') : mostrarError('apellido', 'Por favor, ingresa tu apellido.');
    }
    
    if (name === 'correo') {
      if (value.trim() === '') {
        mostrarError('correo', 'El correo es obligatorio.');
      } else if (!value.includes('@') || !value.includes('.')) {
        mostrarError('correo', 'El correo debe contener "@" y ".".');
      } else {
        quitarError('correo');
      }
    }
    
    if (name === 'motivo') {
      value.trim() === '' ? mostrarError('motivo', 'Por favor, selecciona un motivo.') : quitarError('motivo');
    }
    
    if (name === 'mensaje') {
      const length = value.length;
      setCharCount(length);
      
      if (length === 0) {
        mostrarError('mensaje', 'Por favor, escribe un mensaje.');
      } else if (length > 250) {
        mostrarError('mensaje', 'El mensaje no puede exceder los 250 caracteres.');
      } else {
        quitarError('mensaje');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let esValido = true;

    if (formData.nombre.trim() === '') {
      mostrarError('nombre', 'Por favor, ingresa tu nombre.');
      esValido = false;
    }
    
    if (formData.apellido.trim() === '') {
      mostrarError('apellido', 'Por favor, ingresa tu apellido.');
      esValido = false;
    }
    
    if (formData.correo.trim() === '') {
      mostrarError('correo', 'El correo es obligatorio.');
      esValido = false;
    } else if (!formData.correo.includes('@') || !formData.correo.includes('.')) {
      mostrarError('correo', 'El correo debe contener "@" y ".".');
      esValido = false;
    }
    
    if (formData.motivo.trim() === '') {
      mostrarError('motivo', 'Por favor, selecciona un motivo.');
      esValido = false;
    }
    
    if (formData.mensaje.trim() === '') {
      mostrarError('mensaje', 'Por favor, escribe un mensaje.');
      esValido = false;
    } else if (formData.mensaje.length > 250) {
      mostrarError('mensaje', 'El mensaje no puede exceder los 250 caracteres.');
      esValido = false;
    }

    if (esValido) {
      alert('Formulario enviado correctamente');
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Contacto</h2>
        <div className="row align-items-center">
          <div className="col-md-5 mb-4 mb-md-0 text-center">
            <img 
              src="/Imagenes/Imagen Formulario.jpg" 
              alt="Contacto" 
              className="img-fluid rounded shadow-sm" 
            />
          </div>
          <div className="col-md-7">
            <form id="contactForm" onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input 
                  type="text" 
                  className={`form-control form-control-lg ${errors.nombre ? 'esinvalido' : ''}`}
                  id="nombre" 
                  name="nombre" 
                  placeholder="Ingrese su nombre" 
                  value={formData.nombre}
                  onChange={handleInputChange}
                  onKeyPress={evitarNumeros}
                  required 
                />
                {errors.nombre && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.nombre}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input 
                  type="text" 
                  className={`form-control form-control-lg ${errors.apellido ? 'esinvalido' : ''}`}
                  id="apellido" 
                  name="apellido" 
                  placeholder="Ingrese su apellido" 
                  value={formData.apellido}
                  onChange={handleInputChange}
                  onKeyPress={evitarNumeros}
                  required 
                />
                {errors.apellido && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.apellido}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  className={`form-control form-control-lg ${errors.correo ? 'esinvalido' : ''}`}
                  id="correo" 
                  name="correo" 
                  placeholder="ejemplo@correo.com" 
                  value={formData.correo}
                  onChange={handleInputChange}
                  required 
                />
                {errors.correo && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.correo}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="motivo" className="form-label">Motivo</label>
                <select 
                  className={`form-select form-select-lg ${errors.motivo ? 'esinvalido' : ''}`}
                  id="motivo" 
                  name="motivo" 
                  value={formData.motivo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Selecciona un motivo</option>
                  <option value="consulta">Consulta</option>
                  <option value="reclamo">Reclamo</option>
                  <option value="sugerencia">Sugerencia</option>
                  <option value="otros">Otros</option>
                </select>
                {errors.motivo && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.motivo}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="mensaje" className="form-label">Mensaje</label>
                <textarea 
                  className={`form-control form-control-lg ${errors.mensaje ? 'esinvalido' : ''}`}
                  id="mensaje" 
                  name="mensaje" 
                  rows="4" 
                  maxLength="250" 
                  placeholder="Escribe tu mensaje (máximo 250 caracteres)" 
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  required
                />
                {errors.mensaje && (
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errors.mensaje}
                  </div>
                )}
                <small id="charCount" className="form-text text-muted">
                  {charCount} / 250 caracteres
                </small>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-100">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacto;