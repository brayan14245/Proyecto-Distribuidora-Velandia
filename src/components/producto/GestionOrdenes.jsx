import { actualizarOrden, eliminarOrden } from '../../services/orderService';
import { confirmarAccion, mostrarError, mostrarExito } from '../../services/notificationService';

const estados = ['pendiente', 'confirmada', 'en preparación', 'enviada', 'entregada', 'cancelada'];

export function GestionOrdenes({ ordenes = [], onActualizarOrdenes }) {
  const cambiarEstado = async (orden, estado) => {
    try {
      await actualizarOrden(orden.id, { ...orden, estado });
      mostrarExito('Estado actualizado');
      onActualizarOrdenes();
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      mostrarError('No se pudo actualizar la orden');
    }
  };

  const eliminar = async (orden) => {
    const confirmado = await confirmarAccion(
      '¿Eliminar pedido?',
      'Esta acción no se puede deshacer.'
    );
    if (!confirmado) return;

    try {
      await eliminarOrden(orden.id);
      mostrarExito('Pedido eliminado');
      onActualizarOrdenes();
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      mostrarError('No se pudo eliminar el pedido');
    }
  };

  return (
    <section className="admin-table-container">
      <div className="table-header-info">
        <div>
          <h3 className="table-title">📦 Gestión de pedidos</h3>
          <p className="form-subtitle">Consulta y actualiza el estado de las órdenes.</p>
        </div>
        <span className="table-count">{ordenes.length}</span>
      </div>

      {ordenes.length === 0 ? (
        <p className="loading-text">Todavía no hay pedidos registrados.</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>#{orden.id}</td>
                  <td>{orden.usuario?.nombre || orden.usuarioId}</td>
                  <td>$ {Number(orden.total || 0).toLocaleString('es-CO')}</td>
                  <td>
                    <select
                      className="form-input order-status-select"
                      value={orden.estado || 'pendiente'}
                      onChange={(event) => cambiarEstado(orden, event.target.value)}
                    >
                      {estados.map((estado) => <option value={estado} key={estado}>{estado}</option>)}
                    </select>
                  </td>
                  <td>
                    <button type="button" className="btn-action-delete" onClick={() => eliminar(orden)}>
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
