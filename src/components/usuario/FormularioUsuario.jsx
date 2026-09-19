import { useState } from 'react';
import { mostrarAdvertencia } from '../../services/notificationService';

const initialState = {
  nombre: '',
  email: '',
  telefono: '',
};

export function FormularioUsuario({ onGuardar, onCancelar }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.nombre.trim() || !formData.email.trim()) {
      mostrarAdvertencia('Completa los datos', 'Nombre y correo son obligatorios.');
      return;
    }

    onGuardar && onGuardar(formData);
    setFormData(initialState);
  };

  return (
    <div className="modal-backdrop" onClick={onCancelar}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>Registrar usuario</h3>
          <button type="button" className="cart-close" onClick={onCancelar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Laura Gómez"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 3001234567"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Guardar usuario</button>
            <button type="button" className="btn-cancel" onClick={onCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
