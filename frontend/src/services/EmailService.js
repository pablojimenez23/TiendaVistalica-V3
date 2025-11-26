import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_bvlolhi',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key',
  templates: {
    contactoAdmin: import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACTO || 'template_contacto_admin',
    pedidoAdmin: import.meta.env.VITE_EMAILJS_TEMPLATE_PEDIDO_ADMIN || 'template_pedido_admin'
  },
  adminEmails: ['pa.jimenezf@hotmail.es'] 
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);
export const enviarEmailContacto = async (datos) => {
  try {
    const templateParams = {
      to_email: EMAILJS_CONFIG.adminEmails.join(', '),
      nombre: datos.nombre,
      email: datos.email,
      asunto: datos.asunto,
      mensaje: datos.mensaje
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.contactoAdmin,
      templateParams
    );

    console.log('Email de contacto enviado:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error al enviar email de contacto:', error);
    return { success: false, error };
  }
};


export const enviarEmailNuevoPedido = async (pedido, usuario, productos) => {
  try {

    const productosDetalle = productos.map(item => 
      `<p>${item.producto.nombre} x${item.cantidad} - ${formatearPrecio(item.producto.precio * item.cantidad)}</p>`
    ).join('');

    const templateParams = {
      to_email: EMAILJS_CONFIG.adminEmails.join(', '),
      pedido_id: pedido.id,
      cliente_nombre: `${usuario.nombre} ${usuario.apellido}`,
      cliente_email: usuario.email,
      total: formatearPrecio(pedido.total),
      direccion: pedido.direccionEnvio,
      metodo_pago: pedido.metodoPago,
      productos_detalle: productosDetalle
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templates.pedidoAdmin,
      templateParams
    );

    console.log('Email de nuevo pedido enviado:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error al enviar email de nuevo pedido:', error);
    return { success: false, error };
  }
};


const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(precio);
};

export default {
  enviarEmailContacto,
  enviarEmailNuevoPedido
};