import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useCarrito } from "./Carrito";
import "../Css/FormularioPago.css";

const FormularioPago = () => {
  const { usuario } = useAuth();
  const { carrito, obtenerTotal, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombreTarjeta: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    direccionEnvio: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    telefono: '',
    metodoPago: 'tarjeta'
  });

  const [errors, setErrors] = useState({});

  // Validaciones
  const validarNombreTarjeta = (value) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (value.trim() === '') {
      return 'El nombre en la tarjeta es obligatorio.';
    } else if (!regex.test(value.trim())) {
      return 'El nombre solo puede contener letras y espacios.';
    }
    return '';
  };

  const validarNumeroTarjeta = (value) => {
    const cleanValue = value.replace(/\s/g, '');
    if (cleanValue === '') {
      return 'El número de tarjeta es obligatorio.';
    } else if (!/^\d{16}$/.test(cleanValue)) {
      return 'El número de tarjeta debe tener 16 dígitos.';
    }
    return '';
  };

  const validarFechaExpiracion = (value) => {
    if (value === '') {
      return 'La fecha de expiración es obligatoria.';
    }
    
    const [mes, año] = value.split('/');
    const mesNum = parseInt(mes);
    const añoNum = parseInt('20' + año);
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    const añoActual = fechaActual.getFullYear();

    if (!/^\d{2}\/\d{2}$/.test(value)) {
      return 'Formato inválido. Use MM/AA.';
    }
    
    if (mesNum < 1 || mesNum > 12) {
      return 'Mes inválido (01-12).';
    }

    if (añoNum < añoActual || (añoNum === añoActual && mesNum < mesActual)) {
      return 'La tarjeta está vencida.';
    }

    return '';
  };

  const validarCVV = (value) => {
    if (value === '') {
      return 'El CVV es obligatorio.';
    } else if (!/^\d{3,4}$/.test(value)) {
      return 'El CVV debe tener 3 o 4 dígitos.';
    }
    return '';
  };

  const validarDireccion = (value) => {
    if (value.trim() === '') {
      return 'La dirección de envío es obligatoria.';
    } else if (value.trim().length < 10) {
      return 'La dirección debe tener al menos 10 caracteres.';
    }
    return '';
  };

  const validarCiudad = (value) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (value.trim() === '') {
      return 'La ciudad es obligatoria.';
    } else if (!regex.test(value.trim())) {
      return 'La ciudad solo puede contener letras.';
    }
    return '';
  };

  const validarRegion = (value) => {
    if (value.trim() === '') {
      return 'La región es obligatoria.';
    }
    return '';
  };

  const validarCodigoPostal = (value) => {
    if (value.trim() === '') {
      return 'El código postal es obligatorio.';
    } else if (!/^\d{7}$/.test(value.trim())) {
      return 'El código postal debe tener 7 dígitos.';
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

  // Formatear número de tarjeta (agrega espacios cada 4 dígitos)
  const formatearNumeroTarjeta = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  // Formatear fecha de expiración (MM/AA)
  const formatearFechaExpiracion = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    // Formateo automático
    if (name === 'numeroTarjeta') {
      value = formatearNumeroTarjeta(value);
      if (value.replace(/\s/g, '').length > 16) return;
    }

    if (name === 'fechaExpiracion') {
      value = formatearFechaExpiracion(value);
      if (value.length > 5) return;
    }

    if (name === 'cvv' && value.length > 4) return;
    if (name === 'codigoPostal' && value.length > 7) return;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Validación en tiempo real
    let error = '';
    switch (name) {
      case 'nombreTarjeta':
        error = validarNombreTarjeta(value);
        break;
      case 'numeroTarjeta':
        error = validarNumeroTarjeta(value);
        break;
      case 'fechaExpiracion':
        error = validarFechaExpiracion(value);
        break;
      case 'cvv':
        error = validarCVV(value);
        break;
      case 'direccionEnvio':
        error = validarDireccion(value);
        break;
      case 'ciudad':
        error = validarCiudad(value);
        break;
      case 'region':
        error = validarRegion(value);
        break;
      case 'codigoPostal':
        error = validarCodigoPostal(value);
        break;
      case 'telefono':
        error = validarTelefono(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos comunes
    const newErrors = {
      direccionEnvio: validarDireccion(formData.direccionEnvio),
      ciudad: validarCiudad(formData.ciudad),
      region: validarRegion(formData.region),
      codigoPostal: validarCodigoPostal(formData.codigoPostal),
      telefono: validarTelefono(formData.telefono)
    };

    // Solo validar campos de tarjeta si el método de pago es tarjeta
    if (formData.metodoPago === 'tarjeta') {
      newErrors.nombreTarjeta = validarNombreTarjeta(formData.nombreTarjeta);
      newErrors.numeroTarjeta = validarNumeroTarjeta(formData.numeroTarjeta);
      newErrors.fechaExpiracion = validarFechaExpiracion(formData.fechaExpiracion);
      newErrors.cvv = validarCVV(formData.cvv);
    }

    setErrors(newErrors);

    const formValido = Object.values(newErrors).every(error => error === '');

    if (!formValido) return;

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://54.242.15.41:8080/api";
      
      const pedido = {
        usuario: { id: usuario.id },
        total: obtenerTotal(),
        estado: "PENDIENTE",
        direccionEnvio: `${formData.direccionEnvio}, ${formData.ciudad}, ${formData.region}`,
        metodoPago: formData.metodoPago === 'tarjeta' 
          ? `Tarjeta **** ${formData.numeroTarjeta.slice(-4)}` 
          : 'Transferencia Bancaria'
      };

      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido)
      });

      if (response.ok) {
        await vaciarCarrito();
        alert('¡Pago procesado exitosamente! Tu pedido ha sido registrado.');
        navigate('/pedidos');
      } else {
        alert('Error al procesar el pago. Intenta nuevamente.');
      }
    } catch (error) {
      console.error("Error al procesar pago:", error);
      alert('Error al conectar con el servidor. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  };

  React.useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
    if (carrito.length === 0) {
      navigate('/catalogo');
    }
  }, [usuario, carrito, navigate]);

  if (!usuario || carrito.length === 0) return null;

  return (
    <section className="formulario-pago-container">
      <div className="container py-5">
        <h2 className="text-center mb-4">Finalizar Compra</h2>
        
        <div className="row">
          {/* Resumen del Pedido */}
          <div className="col-lg-4 mb-4">
            <div className="card resumen-pedido">
              <div className="card-header">
                <h5 className="mb-0">Resumen del Pedido</h5>
              </div>
              <div className="card-body">
                {carrito.map((item) => (
                  <div key={item.id} className="resumen-item">
                    <div className="d-flex justify-content-between">
                      <span>{item.producto.nombre} x{item.cantidad}</span>
                      <span>{formatearPrecio(item.producto.precio * item.cantidad)}</span>
                    </div>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between total-pedido">
                  <strong>Total:</strong>
                  <strong className="text-primary">{formatearPrecio(obtenerTotal())}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Pago */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} noValidate>
              
              {/* Método de Pago */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Método de Pago</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="metodoPago"
                        id="tarjeta"
                        value="tarjeta"
                        checked={formData.metodoPago === 'tarjeta'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="tarjeta">
                        <i className="bi bi-credit-card me-2"></i>
                        Tarjeta de Crédito/Débito
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="metodoPago"
                        id="transferencia"
                        value="transferencia"
                        checked={formData.metodoPago === 'transferencia'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="transferencia">
                        <i className="bi bi-bank me-2"></i>
                        Transferencia Bancaria
                      </label>
                    </div>
                  </div>

                  {formData.metodoPago === 'tarjeta' && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="nombreTarjeta" className="form-label">
                          Nombre en la Tarjeta
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.nombreTarjeta ? 'is-invalid' : ''}`}
                          id="nombreTarjeta"
                          name="nombreTarjeta"
                          placeholder="Juan Pérez"
                          value={formData.nombreTarjeta}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                        {errors.nombreTarjeta && (
                          <span className="text-danger">{errors.nombreTarjeta}</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="numeroTarjeta" className="form-label">
                          Número de Tarjeta
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.numeroTarjeta ? 'is-invalid' : ''}`}
                          id="numeroTarjeta"
                          name="numeroTarjeta"
                          placeholder="1234 5678 9012 3456"
                          value={formData.numeroTarjeta}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                        {errors.numeroTarjeta && (
                          <span className="text-danger">{errors.numeroTarjeta}</span>
                        )}
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="fechaExpiracion" className="form-label">
                            Fecha de Expiración
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.fechaExpiracion ? 'is-invalid' : ''}`}
                            id="fechaExpiracion"
                            name="fechaExpiracion"
                            placeholder="MM/AA"
                            value={formData.fechaExpiracion}
                            onChange={handleInputChange}
                            disabled={loading}
                          />
                          {errors.fechaExpiracion && (
                            <span className="text-danger">{errors.fechaExpiracion}</span>
                          )}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="cvv" className="form-label">
                            CVV
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            disabled={loading}
                          />
                          {errors.cvv && (
                            <span className="text-danger">{errors.cvv}</span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Información de Envío */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Información de Envío</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="direccionEnvio" className="form-label">
                      Dirección de Envío
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.direccionEnvio ? 'is-invalid' : ''}`}
                      id="direccionEnvio"
                      name="direccionEnvio"
                      placeholder="Calle Ejemplo 123, Depto 456"
                      value={formData.direccionEnvio}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    {errors.direccionEnvio && (
                      <span className="text-danger">{errors.direccionEnvio}</span>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="ciudad" className="form-label">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.ciudad ? 'is-invalid' : ''}`}
                        id="ciudad"
                        name="ciudad"
                        placeholder="Santiago"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      {errors.ciudad && (
                        <span className="text-danger">{errors.ciudad}</span>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="region" className="form-label">
                        Región
                      </label>
                      <select
                        className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        <option value="">Selecciona una región</option>
                        <option value="Región Metropolitana">Región Metropolitana</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Biobío">Biobío</option>
                        <option value="Araucanía">Araucanía</option>
                        <option value="Los Lagos">Los Lagos</option>
                        <option value="Maule">Maule</option>
                        <option value="O'Higgins">O'Higgins</option>
                      </select>
                      {errors.region && (
                        <span className="text-danger">{errors.region}</span>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="codigoPostal" className="form-label">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.codigoPostal ? 'is-invalid' : ''}`}
                        id="codigoPostal"
                        name="codigoPostal"
                        placeholder="1234567"
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      {errors.codigoPostal && (
                        <span className="text-danger">{errors.codigoPostal}</span>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="telefono" className="form-label">
                        Teléfono de Contacto
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                        id="telefono"
                        name="telefono"
                        placeholder="+56912345678"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      {errors.telefono && (
                        <span className="text-danger">{errors.telefono}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Pago */}
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-5"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card me-2"></i>
                      Pagar {formatearPrecio(obtenerTotal())}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormularioPago;