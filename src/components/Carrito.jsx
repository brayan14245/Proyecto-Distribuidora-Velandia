export function Carrito({ carrito = [], total = 0, abierto = false, onClose, onRemove, onConfirm }) {
  if (!abierto) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-panel" onClick={(event) => event.stopPropagation()}>
        <div className="cart-header">
          <h3>Mi pedido</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {carrito.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {carrito.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.nombre}</strong>
                    <p>
                      {item.cantidad} x $ {(Number(item.precio) || 0).toLocaleString('es-CO')}
                    </p>
                  </div>
                  <button className="btn-remove" onClick={() => onRemove && onRemove(item.id)}>
                    Quitar
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Total</span>
                <strong>$ {Number(total).toLocaleString('es-CO')}</strong>
              </div>
              <button className="btn-confirm" onClick={onConfirm}>Confirmar pedido</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
