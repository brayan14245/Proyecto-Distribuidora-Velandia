import { useState } from 'react';
import {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../../services/categoryService';
import { confirmarAccion, mostrarAdvertencia, mostrarError, mostrarExito } from '../../services/notificationService';

export function GestionCategorias({ categorias = [], onActualizarCategorias }) {
  const [nombre, setNombre] = useState('');
  const [categoriaAEditar, setCategoriaAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const categoriasValidas = (categorias || []).filter((categoria) => {
    const nombreCategoria = (categoria?.nombre || categoria?.label || '').toString().trim();
    return nombreCategoria !== '';
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio || nombreLimpio.toLowerCase() === 'inicio') {
      mostrarAdvertencia('Categoría no válida', 'Ingresa un nombre de categoría válido.');
      return;
    }

    setGuardando(true);
    const solicitud = categoriaAEditar
      ? actualizarCategoria(categoriaAEditar.id, { nombre: nombreLimpio })
      : crearCategoria({ nombre: nombreLimpio });

    solicitud
      .then(() => {
        mostrarExito(categoriaAEditar ? 'Categoría actualizada' : 'Categoría creada');
        setNombre('');
        setCategoriaAEditar(null);
        onActualizarCategorias();
      })
      .catch((error) => {
        console.error('Error al guardar categoría:', error);
        mostrarError('No se pudo guardar la categoría');
      })
      .finally(() => {
        setGuardando(false);
      });
  };

  const handleEditar = (categoria) => {
    setCategoriaAEditar(categoria);
    setNombre(categoria.nombre || categoria.label || '');
  };

  const handleEliminar = async (id) => {
    const confirmado = await confirmarAccion(
      '¿Eliminar categoría?',
      'Esta acción no se puede deshacer.'
    );
    if (!confirmado) return;

    eliminarCategoria(id)
      .then(() => {
        mostrarExito('Categoría eliminada');
        if (categoriaAEditar?.id === id) {
          setCategoriaAEditar(null);
          setNombre('');
        }
        onActualizarCategorias();
      })
      .catch((error) => {
        console.error('Error al eliminar categoría:', error);
        mostrarError('No se pudo eliminar la categoría');
      });
  };

  return (
    <div className="card-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {categoriaAEditar ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
        </h3>
        <p className="form-subtitle">Crea y administra las categorías del catálogo.</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="nombre-categoria" className="form-label">Nombre de la categoría *</label>
          <input
            type="text"
            id="nombre-categoria"
            className="form-input"
            placeholder="Ej. Belleza, Accesorios, Regalos"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : categoriaAEditar ? 'Actualizar Categoría' : 'Guardar Categoría'}
          </button>
          {categoriaAEditar && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setCategoriaAEditar(null);
                setNombre('');
              }}
              disabled={guardando}
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      {categoriasValidas.length > 0 && (
        <div className="category-admin-list">
          {categoriasValidas.map((categoria) => {
            const nombreCategoria = categoria.nombre || categoria.label;
            return (
              <div className="category-admin-item" key={categoria.id}>
                <span>{nombreCategoria}</span>
                <div className="td-actions">
                  <button className="btn-action-edit" onClick={() => handleEditar(categoria)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-action-delete" onClick={() => handleEliminar(categoria.id)}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}