import { useState } from 'react';
import { FormularioProducto } from './FormularioProducto';
import { ListaProductosAdmin } from './ListaProductosAdmin';
import { GestionCategorias } from './GestionCategorias';
import { GestionBanners } from './GestionBanners';
import { GestionOrdenes } from './GestionOrdenes';
import { GestionUsuarios } from './GestionUsuarios';
import { crearProducto, actualizarProducto, eliminarProducto } from '../../services/productService';
import { confirmarAccion, mostrarError, mostrarExito } from '../../services/notificationService';

export function GestionProductos({ productos = [], categorias = [], banners = [], ordenes = [], usuarios = [], onActualizarProductos, onActualizarCategorias, onActualizarBanners, onActualizarOrdenes, onActualizarUsuarios, cargando }) {
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = (formData) => {
    setGuardando(true);
    if (productoAEditar) {
      // Actualizar producto existente
      actualizarProducto(productoAEditar.id, formData)
        .then(() => {
          mostrarExito('Producto actualizado');
          setProductoAEditar(null);
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al actualizar producto:', err);
          mostrarError('No se pudo actualizar el producto');
        })
        .finally(() => {
          setGuardando(false);
        });
    } else {
      // Crear nuevo producto
      crearProducto(formData)
        .then(() => {
          mostrarExito('Producto creado');
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al crear producto:', err);
          mostrarError('No se pudo registrar el producto');
        })
        .finally(() => {
          setGuardando(false);
        });
    }
  };

  const handleEditar = (producto) => {
    setProductoAEditar(producto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEditar = () => {
    setProductoAEditar(null);
  };

  const handleEliminar = async (id) => {
    const confirmado = await confirmarAccion(
      '¿Eliminar producto?',
      'Esta acción no se puede deshacer.'
    );

    if (confirmado) {
      eliminarProducto(id)
        .then(() => {
          mostrarExito('Producto eliminado');
          if (productoAEditar && productoAEditar.id === id) {
            setProductoAEditar(null);
          }
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al eliminar producto:', err);
          mostrarError('No se pudo eliminar el producto');
        });
    }
  };

  return (
    <section className="gestion-productos-section">
      <div className="gestion-header">
        <h2>🛠️ Gestión de Productos</h2>
        <p>Registra nuevos productos o edita/elimina los productos existentes en el catálogo.</p>
      </div>

      <GestionCategorias
        categorias={categorias}
        onActualizarCategorias={onActualizarCategorias}
      />

      <GestionBanners
        banners={banners}
        onActualizarBanners={onActualizarBanners}
      />

      <GestionOrdenes
        ordenes={ordenes}
        onActualizarOrdenes={onActualizarOrdenes}
      />

      <GestionUsuarios
        usuarios={usuarios}
        onActualizarUsuarios={onActualizarUsuarios}
      />

      <FormularioProducto
        productoAEditar={productoAEditar}
        categorias={categorias}
        onGuardar={handleGuardar}
        onCancelar={handleCancelarEditar}
        guardando={guardando}
      />

      <ListaProductosAdmin
        productos={productos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        cargando={cargando}
      />
    </section>
  );
}
