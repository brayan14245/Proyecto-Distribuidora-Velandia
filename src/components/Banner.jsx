import { useEffect, useState } from 'react';

export const slidesPredeterminadas = [
    {
        badge: 'Belleza premium',
        title: 'Descubre tu rutina ideal',
        description: 'Productos para cuidado personal, maquillaje y estilo con una presentación elegante y moderna.',
        accent: 'Beauty Box',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80'
    },
    {
        badge: 'Artículos para regalo',
        title: 'Regalos especiales para cada ocasión',
        description: 'Encuentra detalles pensados para cumpleaños, fechas especiales y momentos inolvidables.',
        accent: 'Gift Picks',
        image: 'https://ecoshopping.com.co/wp-content/uploads/2021/12/Prendas-y-estilos-de-ropa-para-mujer-que-no-deben-faltar-en-tu-armario-1.png'
    },
    {
        badge: 'Accesorios con estilo',
        title: 'Complementa tu look con esencia',
        description: 'Accesorios funcionales y sofisticados para resaltar tu personalidad en cada detalle.',
        accent: 'Style Edit',
        image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80'
    }
];

export function Banner({ banners = [] }) {
    const [slideActual, setSlideActual] = useState(0);
    const slides = banners.length > 0 ? banners : slidesPredeterminadas;

    useEffect(() => {
        setSlideActual(0);
        const intervalo = setInterval(() => {
            setSlideActual((prev) => (prev + 1) % slides.length);
        }, 4500);

        return () => clearInterval(intervalo);
    }, [slides.length]);

    const slide = slides[slideActual];

    return (
        <section className="hero-banner">
            <div className="hero-slider" style={{ backgroundImage: `linear-gradient(135deg, rgba(20,18,30,.2), rgba(20,18,30,.15)), url(${slide.image})` }}>
                <div className="slider-content">
                    <div className="banner-badge">{slide.badge}</div>
                    <h1 className="banner-title">{slide.title}</h1>
                    <p className="banner-subtitle">{slide.description}</p>

                    <div className="banner-accent">{slide.accent}</div>
                </div>

                <div className="slider-dots" aria-label="Indicadores del banner">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`dot ${index === slideActual ? 'active' : ''}`}
                            onClick={() => setSlideActual(index)}
                            aria-label={`Ir al slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}


    