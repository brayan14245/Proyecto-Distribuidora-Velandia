import { useState, useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { Product } from './components/Product';
import { Footer } from './components/Footer';
import { GestionProductos } from './components/producto/GestionProductos';
import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [cartCount, setCartCount] = useState(0);
  const [vista, setVista] = useState("catalogo"); // "catalogo" | "admin"

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = () => {
    setCargando(true);
    obtenerProductos()
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setCargando(false);
      });
  };

  const cargarCategorias = () => {
    obtenerCategorias()
      .then((data) => {
        setCategorias(data);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
      });
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const productosFiltrados = categoriaActiva === "Inicio" 
    ? productos 
    : productos.filter(p => p.categoria && p.categoria.toLowerCase() === categoriaActiva.toLowerCase());

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="app-layout">
      <Header 
        categorias={categorias}
        categoriaActiva={categoriaActiva} 
        onSelectCategoria={setCategoriaActiva}
        cartCount={cartCount}
        vista={vista}
        onCambiarVista={setVista}
      />
      
      <main className="app-container">
        {vista === "catalogo" ? (
          <>
            {/* Banner Section */}
            <Banner />

            {/* Section Header */}
            <section className="catalog-header">
              <div>
                <h2 className="catalog-title">
                  {categoriaActiva === "Inicio" ? "Todos los Productos" : categoriaActiva}
                </h2>
                <p className="catalog-count">{productosFiltrados.length} producto(s) disponibles</p>
              </div>
            </section>

            {/* Product Grid */}
            <section className="product-grid">
              {cargando ? (
                <p className="loading-text">Cargando productos...</p>
              ) : (
                productosFiltrados.map((producto) => (
                  <Product
                    key={producto.id}
                    indice={producto.id}
                    nombre={producto.nombre}
                    descripcion={producto.descripcion}
                    precio={producto.precio}
                    imagen={producto.imagen}
                    tag={producto.tag}
                    onAddToCart={handleAddToCart}
                  />
                ))
              )}
            </section>
          </>
        ) : (
          /* Vista de Administración de Productos */
          <GestionProductos
            productos={productos}
            categorias={categorias}
            onActualizarProductos={cargarProductos}
            onActualizarCategorias={cargarCategorias}
            cargando={cargando}
          />
        )}
      </main>

      {/* Footer integrado directamente en App.jsx */}
      <Footer 
        categorias={categorias}
        setCategoriaActiva={(cat) => {
          setCategoriaActiva(cat);
          setVista("catalogo");
        }}
      />
    </div>
  );
}

export default App;