import { useState } from 'react';
import {
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../../services/categoryService';

export function GestionCategorias({ categorias = [], onActualizarCategorias }) {
  const [nombre, setNombre] = useState('');
  const [categoriaAEditar, setCategoriaAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nombreLimpio = nombre.trim();

    if (!nombreLimpio || nombreLimpio.toLowerCase() === 'inicio') {
      alert('Ingresa un nombre de categoría válido.');
      return;
    }

    setGuardando(true);
    const solicitud = categoriaAEditar
      ? actualizarCategoria(categoriaAEditar.id, { nombre: nombreLimpio })
      : crearCategoria({ nombre: nombreLimpio });

    solicitud
      .then(() => {
        alert(categoriaAEditar ? 'Categoría actualizada con éxito' : 'Categoría creada con éxito');
        setNombre('');
        setCategoriaAEditar(null);
        onActualizarCategorias();
      })
      .catch((error) => {
        console.error('Error al guardar categoría:', error);
        alert('Error al guardar la categoría');
      })
      .finally(() => {
        setGuardando(false);
      });
  };

  const handleEditar = (categoria) => {
    setCategoriaAEditar(categoria);
    setNombre(categoria.nombre || categoria.label || '');
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

    eliminarCategoria(id)
      .then(() => {
        alert('Categoría eliminada con éxito');
        if (categoriaAEditar?.id === id) {
          setCategoriaAEditar(null);
          setNombre('');
        }
        onActualizarCategorias();
      })
      .catch((error) => {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar la categoría');
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
            placeholder="Ej. Combos"
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

      {categorias.length > 0 && (
        <div className="category-admin-list">
          {categorias
            .filter((categoria) => (categoria.nombre || categoria.label) !== 'Inicio')
            .map((categoria) => {
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