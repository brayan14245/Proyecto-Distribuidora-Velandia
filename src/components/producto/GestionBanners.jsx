import { useEffect, useState } from 'react';
import {
  actualizarBanner,
  crearBanner,
  eliminarBanner,
} from '../../services/bannerService';
import { confirmarAccion, mostrarError, mostrarExito } from '../../services/notificationService';

const estadoInicial = {
  badge: '',
  title: '',
  description: '',
  accent: '',
  image: '',
};

export function GestionBanners({ banners = [], onActualizarBanners }) {
  const [bannerAEditar, setBannerAEditar] = useState(null);
  const [formData, setFormData] = useState(estadoInicial);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (bannerAEditar) {
      setFormData({
        badge: bannerAEditar.badge || '',
        title: bannerAEditar.title || '',
        description: bannerAEditar.description || '',
        accent: bannerAEditar.accent || '',
        image: bannerAEditar.image || '',
      });
    } else {
      setFormData(estadoInicial);
    }
  }, [bannerAEditar]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGuardando(true);

    try {
      if (bannerAEditar) {
        await actualizarBanner(bannerAEditar.id, formData);
        mostrarExito('Banner actualizado');
      } else {
        await crearBanner(formData);
        mostrarExito('Banner creado');
      }

      setBannerAEditar(null);
      onActualizarBanners();
    } catch (error) {
      console.error('Error al guardar banner:', error);
      mostrarError('No se pudo guardar el banner');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    const confirmado = await confirmarAccion(
      '¿Eliminar banner?',
      'Esta acción no se puede deshacer.'
    );

    if (!confirmado) return;

    try {
      await eliminarBanner(id);
      mostrarExito('Banner eliminado');
      if (bannerAEditar?.id === id) setBannerAEditar(null);
      onActualizarBanners();
    } catch (error) {
      console.error('Error al eliminar banner:', error);
      mostrarError('No se pudo eliminar el banner');
    }
  };

  return (
    <div className="card-form-container banner-admin-section">
      <div className="form-header">
        <h3 className="form-title">
          {bannerAEditar ? '✏️ Editar Banner' : '🖼️ Nuevo Banner'}
        </h3>
        <p className="form-subtitle">Administra las imágenes y textos del banner principal.</p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="banner-badge" className="form-label">Etiqueta *</label>
            <input
              id="banner-badge"
              name="badge"
              className="form-input"
              value={formData.badge}
              onChange={handleChange}
              placeholder="Ej. Belleza premium"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="banner-accent" className="form-label">Texto destacado *</label>
            <input
              id="banner-accent"
              name="accent"
              className="form-input"
              value={formData.accent}
              onChange={handleChange}
              placeholder="Ej. Beauty Box"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="banner-title" className="form-label">Título *</label>
          <input
            id="banner-title"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título principal del banner"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="banner-description" className="form-label">Descripción *</label>
          <textarea
            id="banner-description"
            name="description"
            className="form-input form-textarea"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Texto descriptivo del banner"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="banner-image" className="form-label">URL de la imagen *</label>
          <input
            id="banner-image"
            name="image"
            type="url"
            className="form-input"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://ejemplo.com/banner.jpg"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : bannerAEditar ? 'Actualizar Banner' : 'Guardar Banner'}
          </button>
          {bannerAEditar && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setBannerAEditar(null)}
              disabled={guardando}
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      {banners.length > 0 && (
        <div className="banner-admin-list">
          {banners.map((banner) => (
            <div className="banner-admin-item" key={banner.id}>
              <img src={banner.image} alt={banner.title} className="banner-admin-image" />
              <div className="banner-admin-info">
                <strong>{banner.title}</strong>
                <span>{banner.badge}</span>
              </div>
              <div className="td-actions">
                <button className="btn-action-edit" onClick={() => setBannerAEditar(banner)}>
                  ✏️ Editar
                </button>
                <button className="btn-action-delete" onClick={() => handleEliminar(banner.id)}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
