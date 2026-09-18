import { Menu } from "./Menu";
import logoDV from '../assets/LogoDV.png';

export function Header({ 
  categorias = [], 
  categoriaActiva, 
  onSelectCategoria, 
  cartCount = 0,
  vista = "catalogo",
  onCambiarVista
}) {

    return (
        <header className="header-navbar">
            <div className="header-inner">
                {/* Brand / Logo */}
                <div className="header-brand" onClick={() => onCambiarVista && onCambiarVista("catalogo")}>
                    <img src={logoDV} alt="Distribuidora Velandia" className="brand-logo" />
                </div>
                
                {/* Categories Navigation */}
                {vista === "catalogo" ? (
                    <Menu categorias={categorias} onSelectCategoria={onSelectCategoria} categoriaActiva={categoriaActiva} />
                ) : (
                    <div className="view-title-nav">
                        <span className="view-badge">Modo Administración</span>
                    </div>
                )}

                {/* Actions */}
                <div className="header-actions" style={{ gap: '12px' }}>
                    <div className="view-nav">
                        <button 
                            className={`view-btn ${vista === "catalogo" ? "active" : ""}`}
                            onClick={() => onCambiarVista && onCambiarVista("catalogo")}
                        >
                            🛍️ Catálogo
                        </button>
                        <button 
                            className={`view-btn ${vista === "admin" ? "active" : ""}`}
                            onClick={() => onCambiarVista && onCambiarVista("admin")}
                        >
                            ⚙️ Productos
                        </button>
                    </div>

                    {vista === "catalogo" && (
                        <button className="cart-button">
                            <span className="cart-icon">🛒</span>
                            <span className="cart-label">Mi Pedido</span>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}


    