import { useState } from 'react';
import { mostrarError } from '../../services/notificationService';

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export function LoginAdmin({ onAuthenticated, onCancelar }) {
  const [credenciales, setCredenciales] = useState({ usuario: '', contrasena: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredenciales((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (credenciales.usuario.trim() !== ADMIN_USERNAME || credenciales.contrasena !== ADMIN_PASSWORD) {
      mostrarError('Acceso denegado', 'El usuario o la contraseña no son correctos.');
      return;
    }

    onAuthenticated();
  };

  return (
    <div className="modal-backdrop" onClick={onCancelar}>
      <div className="modal-card admin-login-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="login-eyebrow">Área privada</span>
            <h3>Acceso administrador</h3>
          </div>
          <button type="button" className="cart-close" onClick={onCancelar}>✕</button>
        </div>

        <p className="login-description">Ingresa tus credenciales para administrar productos y categorías.</p>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="admin-usuario">Usuario</label>
            <input
              id="admin-usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              value={credenciales.usuario}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-contrasena">Contraseña</label>
            <input
              id="admin-contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              value={credenciales.contrasena}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Ingresar al panel</button>
            <button type="button" className="btn-cancel" onClick={onCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
