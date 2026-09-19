import { Menu } from './Menu';
import logoDV from '../assets/LogoDV.png';

export function Header({
  categorias = [],
  categoriaActiva,
  onSelectCategoria,
  cartCount = 0,
  vista = 'catalogo',
  onCambiarVista,
  onToggleCarrito,
  onAbrirRegistroUsuario,
  onSolicitarAdmin,
  onCerrarAdmin,
  adminAutenticado = false,
  usuarioActual = null,
}) {
  return (
    <header className="header-navbar">
      <div className="header-inner">
        <div className="header-brand" onClick={() => onCambiarVista && onCambiarVista('catalogo')}>
          <img src={logoDV} alt="Distribuidora Velandia" className="brand-logo" />
        </div>

        {vista === 'catalogo' ? (
          <Menu categorias={categorias} onSelectCategoria={onSelectCategoria} categoriaActiva={categoriaActiva} />
        ) : vista === 'historial' ? (
          <div className="view-title-nav">
            <span className="view-badge">Mis pedidos</span>
          </div>
        ) : (
          <div className="view-title-nav">
            <span className="view-badge">Modo Administración</span>
          </div>
        )}

        <div className="header-actions" style={{ gap: '12px' }}>
          <div className="view-nav">
            <button
              className={`view-btn ${vista === 'catalogo' ? 'active' : ''}`}
              onClick={() => onCambiarVista && onCambiarVista('catalogo')}
            >
              🛍️ Catálogo
            </button>
            <button
              className={`view-btn ${vista === 'admin' ? 'active' : ''}`}
              onClick={() => {
                if (adminAutenticado) {
                  if (vista === 'admin') {
                    onCerrarAdmin && onCerrarAdmin();
                  } else {
                    onSolicitarAdmin && onSolicitarAdmin();
                  }
                  return;
                }

                onSolicitarAdmin && onSolicitarAdmin();
              }}
            >
              {adminAutenticado && vista === 'admin' ? '↩️ Salir admin' : '⚙️ Administración'}
            </button>
            {usuarioActual && (
              <button
                className={`view-btn ${vista === 'historial' ? 'active' : ''}`}
                onClick={() => onCambiarVista && onCambiarVista('historial')}
              >
                📦 Pedidos
              </button>
            )}
          </div>

          {vista === 'catalogo' && (
            <>
              <button className="user-button" onClick={() => onAbrirRegistroUsuario && onAbrirRegistroUsuario()}>
                {usuarioActual ? `👤 ${usuarioActual.nombre}` : '👤 Mi cuenta'}
              </button>

              <button className="cart-button" onClick={() => onToggleCarrito && onToggleCarrito()}>
                <span className="cart-icon">🛒</span>
                <span className="cart-label">Mi Pedido</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
