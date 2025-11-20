import React, { useState } from "react";
import "../Css/Estilo.css";

const Boletin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const mostrarError = (mensaje) => setError(mensaje);
  const quitarError = () => setError("");

  const validar = (e) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    quitarError();

    if (emailTrimmed === "") {
      mostrarError("Por favor, ingresa tu correo.");
    } else if (!emailTrimmed.includes("@") || !emailTrimmed.includes(".")) {
      mostrarError("Por favor, ingresa un correo con formato válido.");
    } else {
      alert("¡Suscripción realizada correctamente!");
      setEmail("");
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) quitarError();
  };

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="mb-3">Suscríbete a nuestro boletín</h2>
        <p className="text-muted">
          Recibe novedades, descuentos y colecciones exclusivas.
        </p>
        <form
          id="boletinForm"
          className="row justify-content-center"
          onSubmit={validar}
        >
          <div className="col-md-6 col-lg-4">
            <div className="input-group">
              <input
                type="email"
                id="correoBoletin"
                value={email}
                onChange={handleInputChange}
                className={`form-control ${error ? "esinvalido" : ""}`}
                placeholder="Tu correo electrónico"
              />
              <button className="btn btn-primary" type="submit">
                Suscribirme
              </button>
            </div>
            {error && (
              <div
                id="boletinFeedback"
                style={{ color: "red", fontSize: "0.9rem" }}
              >
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Boletin;