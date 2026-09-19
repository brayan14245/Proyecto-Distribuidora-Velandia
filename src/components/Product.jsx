import { useState } from 'react';

export function Product({ indice, nombre, descripcion, precio, imagen, tag, stock = 0, onAddToCart }) {
    const precioFormateado = typeof precio === 'number'
        ? `$ ${precio.toLocaleString('es-CO')}`
        : typeof precio === 'string' && precio.startsWith('$')
            ? precio
            : `$ ${precio ?? 0}`;

    const stockDisponible = Number(stock) || 0;
    const sinStock = stockDisponible <= 0;
    const [cantidad, setCantidad] = useState(1);

    const handleCantidadMas = () => {
        setCantidad((prev) => Math.min(prev + 1, stockDisponible || 99));
    };

    const handleCantidadMenos = () => {
        setCantidad((prev) => Math.max(1, prev - 1));
    };

    return (
        <article className="product-card" key={indice}>
            <div className="product-image-container">
                {tag && <span className="product-tag">{tag}</span>}
                {imagen ? (
                    <img src={imagen} alt={nombre} className="product-image" loading="lazy" />
                ) : (
                    <div className="product-image-placeholder"></div>
                )}
            </div>
            <div className="product-content">
                <h3 className="product-title">{nombre}</h3>
                <p className="product-description">{descripcion}</p>
                <div className="product-meta-row">
                    <span className={`stock-pill ${sinStock ? 'out' : ''}`}>
                        {sinStock ? 'Sin stock' : `Stock: ${stockDisponible}`}
                    </span>
                </div>
                <div className="product-footer">
                    <div className="price-wrapper">
                        <span className="price-label">Precio</span>
                        <span className="product-price">{precioFormateado}</span>
                    </div>

                    <div className="product-actions">
                        <div className="quantity-picker">
                            <button type="button" className="qty-btn" onClick={handleCantidadMenos} disabled={sinStock}>−</button>
                            <span className="qty-value">{cantidad}</span>
                            <button type="button" className="qty-btn" onClick={handleCantidadMas} disabled={sinStock}>+</button>
                        </div>

                        <button
                            className="btn-add-order"
                            disabled={sinStock}
                            onClick={() => {
                                if (onAddToCart) {
                                    onAddToCart(cantidad);
                                }
                                setCantidad(1);
                            }}
                        >
                            <span className="btn-plus">+</span> {sinStock ? 'Agotado' : `Agregar ${cantidad}`}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}