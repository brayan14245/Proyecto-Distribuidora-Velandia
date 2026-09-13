import { useState } from 'react';
import { FormularioProducto } from './FormularioProducto';
import { ListaProductosAdmin } from './ListaProductosAdmin';
import { GestionCategorias } from './GestionCategorias';
import { crearProducto, actualizarProducto, eliminarProducto } from '../../services/productService';

export function GestionProductos({ productos = [], categorias = [], onActualizarProductos, onActualizarCategorias, cargando }) {
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = (formData) => {
    setGuardando(true);
    if (productoAEditar) {
      // Actualizar producto existente
      actualizarProducto(productoAEditar.id, formData)
        .then(() => {
          alert('Producto actualizado con éxito');
          setProductoAEditar(null);
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al actualizar producto:', err);
          alert('Error al actualizar el producto');
        })
        .finally(() => {
          setGuardando(false);
        });
    } else {
      // Crear nuevo producto
      crearProducto(formData)
        .then(() => {
          alert('Producto creado con éxito');
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al crear producto:', err);
          alert('Error al registrar el producto');
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

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      eliminarProducto(id)
        .then(() => {
          alert('Producto eliminado con éxito');
          if (productoAEditar && productoAEditar.id === id) {
            setProductoAEditar(null);
          }
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al eliminar producto:', err);
          alert('Error al eliminar el producto');
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
