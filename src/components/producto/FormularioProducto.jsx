import { useState, useEffect } from 'react';

export function FormularioProducto({ productoAEditar, categorias = [], onGuardar, onCancelar, guardando }) {
  const categoriasValidas = (categorias || []).filter((categoria) => {
    const nombreCategoria = (categoria?.nombre || categoria?.label || '').toString().trim();
    return nombreCategoria !== '' && nombreCategoria.toLowerCase() !== 'inicio';
  });

  const initialFormState = {
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: categoriasValidas.length > 0 ? (categoriasValidas[0].nombre || categoriasValidas[0].label) : 'Hamburguesas',
    imagen: '',
    tag: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (productoAEditar) {
      setFormData({
        nombre: productoAEditar.nombre || '',
        descripcion: productoAEditar.descripcion || '',
        precio: productoAEditar.precio || '',
        categoria: productoAEditar.categoria || (categoriasValidas[0]?.nombre || categoriasValidas[0]?.label || 'Hamburguesas'),
        imagen: productoAEditar.imagen || '',
        tag: productoAEditar.tag || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [productoAEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.precio) {
      alert('Por favor completa el nombre y el precio del producto.');
      return;
    }
    onGuardar(formData);
  };

  const esEdicion = Boolean(productoAEditar);

  return (
    <div className="card-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {esEdicion ? '✏️ Editar Producto' : '➕ Registrar Nuevo Producto'}
        </h3>
        <p className="form-subtitle">
          {esEdicion ? 'Modifica los datos del producto seleccionado' : 'Ingresa los datos para agregar un producto al catálogo'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre del Producto *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              placeholder="Ej. Hamburguesa Doble Queso"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Precio */}
          <div className="form-group">
            <label htmlFor="precio" className="form-label">Precio ($) *</label>
            <input
              type="text"
              id="precio"
              name="precio"
              className="form-input"
              placeholder="Ej. 18500 o $18.500"
              value={formData.precio}
              onChange={handleChange}
              required
            />
          </div>

          {/* Categoría */}
          <div className="form-group">
            <label htmlFor="categoria" className="form-label">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              className="form-input"
              value={formData.categoria}
              onChange={handleChange}
            >
              {categoriasValidas.length > 0 ? (
                categoriasValidas.map(c => {
                  const val = c.nombre || c.label;
                  return <option key={c.id} value={val}>{val}</option>;
                })
              ) : (
                <>
                  <option value="Hamburguesas">Hamburguesas</option>
                  <option value="Perros Calientes">Perros Calientes</option>
                  <option value="Salchipapas">Salchipapas</option>
                  <option value="Bebidas">Bebidas</option>
                </>
              )}
            </select>
          </div>

          {/* Tag / Etiqueta */}
          <div className="form-group">
            <label htmlFor="tag" className="form-label">Etiqueta (Opcional)</label>
            <input
              type="text"
              id="tag"
              name="tag"
              className="form-input"
              placeholder="Ej. Popular, Nuevo, Combo"
              value={formData.tag}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Imagen URL */}
        <div className="form-group">
          <label htmlFor="imagen" className="form-label">URL de la Imagen</label>
          <input
            type="url"
            id="imagen"
            name="imagen"
            className="form-input"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={formData.imagen}
            onChange={handleChange}
          />
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-input form-textarea"
            placeholder="Detalles sobre los ingredientes o características del producto..."
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
          
          {esEdicion && (
            <button type="button" className="btn-cancel" onClick={onCancelar} disabled={guardando}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
