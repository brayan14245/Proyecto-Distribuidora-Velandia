import { useState } from 'react';
import { actualizarUsuario, eliminarUsuario } from '../../services/userService';
import { confirmarAccion, mostrarError, mostrarExito } from '../../services/notificationService';

export function GestionUsuarios({ usuarios = [], onActualizarUsuarios }) {
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const guardarCambios = async (event) => {
    event.preventDefault();
    try {
      await actualizarUsuario(usuarioEditando.id, usuarioEditando);
      mostrarExito('Usuario actualizado');
      setUsuarioEditando(null);
      onActualizarUsuarios();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      mostrarError('No se pudo actualizar el usuario');
    }
  };

  const eliminar = async (usuario) => {
    const confirmado = await confirmarAccion('¿Eliminar usuario?', 'Esta acción no se puede deshacer.');
    if (!confirmado) return;

    try {
      await eliminarUsuario(usuario.id);
      mostrarExito('Usuario eliminado');
      onActualizarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      mostrarError('No se pudo eliminar el usuario');
    }
  };

  return (
    <section className="admin-table-container">
      <div className="table-header-info">
        <h3 className="table-title">👥 Gestión de usuarios</h3>
        <span className="table-count">{usuarios.length}</span>
      </div>

      {usuarioEditando && (
        <form className="product-form user-admin-edit" onSubmit={guardarCambios}>
          <div className="form-grid">
            {['nombre', 'email', 'telefono'].map((campo) => (
              <div className="form-group" key={campo}>
                <label className="form-label" htmlFor={`usuario-${campo}`}>{campo}</label>
                <input
                  id={`usuario-${campo}`}
                  className="form-input"
                  value={usuarioEditando[campo] || ''}
                  onChange={(event) => setUsuarioEditando((prev) => ({ ...prev, [campo]: event.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save">Guardar cambios</button>
            <button type="button" className="btn-cancel" onClick={() => setUsuarioEditando(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="table-responsive">
        <table className="admin-table">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Acciones</th></tr></thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>{usuario.telefono || 'Sin teléfono'}</td>
                <td className="td-actions">
                  <button type="button" className="btn-action-edit" onClick={() => setUsuarioEditando({ ...usuario })}>✏️ Editar</button>
                  <button type="button" className="btn-action-delete" onClick={() => eliminar(usuario)}>🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}