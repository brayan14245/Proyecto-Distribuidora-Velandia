import { useEffect, useState } from 'react';
import { obtenerOrdenesPorUsuario } from '../../services/orderService';

export function HistorialPedidos({ usuario, onVolver }) {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerOrdenesPorUsuario(usuario.id)
      .then(setOrdenes)
      .catch((error) => console.error('Error al cargar historial:', error))
      .finally(() => setCargando(false));
  }, [usuario.id]);

  return (
    <section className="order-history">
      <div className="gestion-header">
        <h2>📦 Mis pedidos</h2>
        <p>Consulta el estado y el resumen de tus compras.</p>
      </div>
      <button type="button" className="btn-cancel" onClick={onVolver}>Volver al catálogo</button>
      {cargando && <p className="loading-text">Cargando pedidos...</p>}
      {!cargando && ordenes.length === 0 && (
        <p className="loading-text">Todavía no tienes pedidos registrados.</p>
      )}
      <div className="order-history-list">
        {ordenes.map((orden) => (
          <article className="order-history-item" key={orden.id}>
            <div>
              <strong>Pedido #{orden.id}</strong>
              <p>{new Date(orden.fecha).toLocaleString('es-CO')}</p>
            </div>
            <span className="badge-category">{orden.estado}</span>
            <strong>$ {Number(orden.total || 0).toLocaleString('es-CO')}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
