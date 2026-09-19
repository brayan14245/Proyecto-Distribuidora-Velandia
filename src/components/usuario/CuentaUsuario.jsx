import { useState } from 'react';
import { mostrarAdvertencia } from '../../services/notificationService';

const registroInicial = {
  nombre: '',
  email: '',
  telefono: '',
  contrasena: '',
};

const accesoInicial = {
  email: '',
  contrasena: '',
};

export function CuentaUsuario({ usuarioActual = null, onCrearUsuario, onIniciarSesion, onCerrarSesion, onCancelar }) {
  const [modo, setModo] = useState('iniciar');
  const [registro, setRegistro] = useState(registroInicial);
  const [acceso, setAcceso] = useState(accesoInicial);

  const handleRegistroChange = (event) => {
    const { name, value } = event.target;
    setRegistro((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccesoChange = (event) => {
    const { name, value } = event.target;
    setAcceso((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistroSubmit = (event) => {
    event.preventDefault();

    if (!registro.nombre.trim() || !registro.email.trim()) {
      mostrarAdvertencia('Completa los datos', 'Nombre y correo son obligatorios.');
      return;
    }

    if (registro.contrasena.length < 6) {
      mostrarAdvertencia('Contraseña no válida', 'La contraseña debe tener mínimo 6 caracteres.');
      return;
    }

    onCrearUsuario(registro);
  };

  const handleAccesoSubmit = (event) => {
    event.preventDefault();

    if (!acceso.email.trim() || !acceso.contrasena) {
      mostrarAdvertencia('Completa los datos', 'Correo y contraseña son obligatorios.');
      return;
    }

    onIniciarSesion(acceso);
  };

  return (
    <div className="modal-backdrop" onClick={onCancelar}>
      <div className="modal-card account-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="login-eyebrow">Tu cuenta</span>
            <h3>{usuarioActual ? 'Sesión activa' : modo === 'iniciar' ? 'Iniciar sesión' : 'Crear usuario'}</h3>
          </div>
          <button type="button" className="cart-close" onClick={onCancelar}>✕</button>
        </div>

        {usuarioActual ? (
          <div className="account-session">
            <div className="account-session-avatar">👤</div>
            <p className="account-session-label">Has iniciado sesión como</p>
            <h4>{usuarioActual.nombre}</h4>
            <p className="account-session-email">{usuarioActual.email}</p>
            <div className="form-actions">
              <button type="button" className="btn-action-delete" onClick={onCerrarSesion}>
                Cerrar sesión
              </button>
              <button type="button" className="btn-cancel" onClick={onCancelar}>Cerrar</button>
            </div>
          </div>
        ) : (
          <>
            <div className="account-tabs" role="tablist" aria-label="Opciones de cuenta">
              <button
                type="button"
                className={`account-tab ${modo === 'iniciar' ? 'active' : ''}`}
                onClick={() => setModo('iniciar')}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                className={`account-tab ${modo === 'crear' ? 'active' : ''}`}
                onClick={() => setModo('crear')}
              >
                Crear usuario
              </button>
            </div>

            {modo === 'iniciar' ? (
          <form onSubmit={handleAccesoSubmit} className="user-form">
            <p className="login-description">Accede para confirmar tus pedidos con tus datos guardados.</p>

            <div className="form-group">
              <label htmlFor="cuenta-email">Correo electrónico</label>
              <input
                id="cuenta-email"
                name="email"
                type="email"
                autoComplete="email"
                value={acceso.email}
                onChange={handleAccesoChange}
                placeholder="correo@ejemplo.com"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="cuenta-contrasena">Contraseña</label>
              <input
                id="cuenta-contrasena"
                name="contrasena"
                type="password"
                autoComplete="current-password"
                value={acceso.contrasena}
                onChange={handleAccesoChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">Ingresar</button>
              <button type="button" className="btn-cancel" onClick={onCancelar}>Cancelar</button>
            </div>
          </form>
            ) : (
          <form onSubmit={handleRegistroSubmit} className="user-form">
            <p className="login-description">Crea tu cuenta para guardar tus datos y confirmar pedidos.</p>

            <div className="form-group">
              <label htmlFor="registro-nombre">Nombre completo</label>
              <input
                id="registro-nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                value={registro.nombre}
                onChange={handleRegistroChange}
                placeholder="Ej: Laura Gómez"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="registro-email">Correo electrónico</label>
              <input
                id="registro-email"
                name="email"
                type="email"
                autoComplete="email"
                value={registro.email}
                onChange={handleRegistroChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registro-telefono">Teléfono</label>
              <input
                id="registro-telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                value={registro.telefono}
                onChange={handleRegistroChange}
                placeholder="Ej: 3001234567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="registro-contrasena">Contraseña</label>
              <input
                id="registro-contrasena"
                name="contrasena"
                type="password"
                autoComplete="new-password"
                value={registro.contrasena}
                onChange={handleRegistroChange}
                placeholder="Mínimo 6 caracteres"
                minLength="6"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">Crear usuario</button>
              <button type="button" className="btn-cancel" onClick={onCancelar}>Cancelar</button>
            </div>
          </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
