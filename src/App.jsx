import { useState, useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { Product } from './components/Product';
import { Footer } from './components/Footer';
import { GestionProductos } from './components/producto/GestionProductos';
import { Carrito } from './components/Carrito';
import { CuentaUsuario } from './components/usuario/CuentaUsuario';
import { LoginAdmin } from './components/usuario/LoginAdmin';
import { obtenerProductos, actualizarProducto } from './services/productService';
import { obtenerCategorias } from './services/categoryService';
import { obtenerBanners } from './services/bannerService';
import { crearUsuario as crearUsuarioApi } from './services/userService';
import { autenticarUsuario } from './services/userService';
import { obtenerCarrito } from './services/storeService';
import { guardarCarrito } from './services/storeService';
import { agregarAlCarrito } from './services/storeService';
import { quitarDelCarrito } from './services/storeService';
import { calcularTotalCarrito } from './services/storeService';
import { descontarStockProductos } from './services/storeService';
import { mostrarAdvertencia, mostrarError, mostrarExito } from './services/notificationService';

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Inicio');
  const [vista, setVista] = useState('catalogo');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarFormularioUsuario, setMostrarFormularioUsuario] = useState(false);
  const [mostrarLoginAdmin, setMostrarLoginAdmin] = useState(false);
  const [adminAutenticado, setAdminAutenticado] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [banners, setBanners] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const data = await obtenerProductos();
      setProductos(data);
      return data;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return [];
    } finally {
      setCargando(false);
    }
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

  const cargarBanners = async () => {
    try {
      const data = await obtenerBanners();
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al obtener los banners:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarBanners();
    setCarrito(obtenerCarrito());
  }, []);

  useEffect(() => {
    guardarCarrito(carrito);
  }, [carrito]);

  const productosFiltrados = categoriaActiva === 'Inicio'
    ? productos
    : productos.filter((p) => p.categoria && p.categoria.toLowerCase() === categoriaActiva.toLowerCase());

  const handleAddToCart = (producto, cantidad = 1) => {
    if (!producto) return;

    const cantidadSolicitada = Number(cantidad) || 1;
    const stockDisponible = Number(producto.stock ?? 0);
    const yaEnCarrito = carrito.find((item) => item.id === producto.id);
    const cantidadActual = yaEnCarrito ? yaEnCarrito.cantidad : 0;

    if (stockDisponible > 0 && cantidadActual + cantidadSolicitada > stockDisponible) {
      mostrarAdvertencia('Stock insuficiente', 'No hay suficiente stock para esa cantidad.');
      return;
    }

    setCarrito((prev) => agregarAlCarrito(prev, producto, stockDisponible, cantidadSolicitada));
  };

  const handleRemoveFromCart = (productoId) => {
    setCarrito((prev) => quitarDelCarrito(prev, productoId));
  };

  const cartCount = carrito.reduce((total, item) => total + Number(item.cantidad || 0), 0);
  const totalPedido = calcularTotalCarrito(carrito);

  const confirmarPedido = async () => {
    if (!usuarioActual) {
      setMostrarFormularioUsuario(true);
      mostrarAdvertencia('Registra tus datos', 'Debes registrar un usuario antes de confirmar tu pedido.');
      return;
    }

    if (carrito.length === 0) {
      mostrarAdvertencia('Carrito vacío', 'Agrega al menos un producto antes de confirmar tu pedido.');
      return;
    }

    try {
      const productosActuales = await cargarProductos();
      const productosBase = productosActuales.length > 0 ? productosActuales : productos;
      const productosActualizados = descontarStockProductos(productosBase, carrito);

      const stockInsuficiente = carrito.some((item) => {
        const productoBase = productosBase.find((producto) => Number(producto.id) === Number(item.id));
        const stockActual = Number(productoBase?.stock ?? 0);
        const cantidadSolicitada = Number(item.cantidad) || 0;
        return stockActual < cantidadSolicitada;
      });

      if (stockInsuficiente) {
        mostrarAdvertencia('Stock insuficiente', 'Hay un producto del carrito sin stock suficiente en este momento.');
        return;
      }

      const stockPorId = new Map(
        productosActualizados.map((producto) => [String(producto.id), producto])
      );

      await Promise.all(
        productosActualizados.map(async (productoActualizado) => {
          const productoOriginal = productosBase.find((item) => Number(item.id) === Number(productoActualizado.id));
          if (!productoOriginal) return;

          const cambios = {
            ...productoOriginal,
            ...productoActualizado,
            stock: Number(productoActualizado.stock) || 0,
          };

          await actualizarProducto(productoActualizado.id, cambios);
        })
      );

      setProductos((prev) => prev.map((producto) => {
        const actualizado = stockPorId.get(String(producto.id));
        return actualizado ? { ...producto, ...actualizado, stock: Number(actualizado.stock) || 0 } : producto;
      }));

      setCarrito([]);
      setMostrarCarrito(false);
      mostrarExito(
        'Pedido confirmado',
        `Gracias, ${usuarioActual.nombre}. Total: $ ${totalPedido.toLocaleString('es-CO')}`
      );
      await cargarProductos();
    } catch (error) {
      console.error('Error al confirmar el pedido:', error);
      mostrarError('No se pudo confirmar el pedido', 'Inténtalo de nuevo.');
    }
  };

  const handleCrearUsuario = async (datosUsuario) => {
    try {
      const nuevoUsuario = await crearUsuarioApi(datosUsuario);
      setUsuarioActual(nuevoUsuario);
      setMostrarFormularioUsuario(false);
      mostrarExito('Usuario registrado', `Bienvenido, ${nuevoUsuario.nombre}.`);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      mostrarError('No se pudo registrar el usuario', 'Inténtalo de nuevo.');
    }
  };

  const handleIniciarSesion = async (credenciales) => {
    try {
      const usuario = await autenticarUsuario(credenciales);

      if (!usuario) {
        mostrarAdvertencia('Datos incorrectos', 'Verifica tu correo y contraseña.');
        return;
      }

      setUsuarioActual(usuario);
      setMostrarFormularioUsuario(false);
      mostrarExito('Sesión iniciada', `Bienvenido, ${usuario.nombre}.`);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      mostrarError('No se pudo iniciar sesión', 'Inténtalo de nuevo.');
    }
  };

  const solicitarVistaAdmin = () => {
    if (adminAutenticado) {
      setVista('admin');
      return;
    }

    setMostrarLoginAdmin(true);
  };

  const cerrarSesionAdmin = () => {
    setAdminAutenticado(false);
    setVista('catalogo');
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
        onToggleCarrito={() => setMostrarCarrito((prev) => !prev)}
        onAbrirRegistroUsuario={() => setMostrarFormularioUsuario(true)}
        onSolicitarAdmin={solicitarVistaAdmin}
        onCerrarAdmin={cerrarSesionAdmin}
        adminAutenticado={adminAutenticado}
        usuarioActual={usuarioActual}
      />

      <main className="app-container">
        {vista === 'catalogo' ? (
          <>
            <Banner banners={banners} />

            <section className="catalog-header">
              <div>
                <h2 className="catalog-title">
                  {categoriaActiva === 'Inicio' ? 'Todos los Productos' : categoriaActiva}
                </h2>
                <p className="catalog-count">{productosFiltrados.length} producto(s) disponibles</p>
              </div>
            </section>

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
                    stock={producto.stock}
                    onAddToCart={(cantidad) => handleAddToCart(producto, cantidad)}
                  />
                ))
              )}
            </section>
          </>
        ) : adminAutenticado ? (
          <GestionProductos
            productos={productos}
            categorias={categorias}
            banners={banners}
            onActualizarProductos={cargarProductos}
            onActualizarCategorias={cargarCategorias}
            onActualizarBanners={cargarBanners}
            cargando={cargando}
          />
        ) : null}
      </main>

      <Carrito
        carrito={carrito}
        total={totalPedido}
        abierto={mostrarCarrito}
        onClose={() => setMostrarCarrito(false)}
        onRemove={handleRemoveFromCart}
        onConfirm={confirmarPedido}
      />

      {mostrarFormularioUsuario && (
        <CuentaUsuario
          usuarioActual={usuarioActual}
          onCrearUsuario={handleCrearUsuario}
          onIniciarSesion={handleIniciarSesion}
          onCerrarSesion={() => {
            setUsuarioActual(null);
            setMostrarFormularioUsuario(false);
            mostrarExito('Sesión cerrada', 'Has cerrado tu sesión correctamente.');
          }}
          onCancelar={() => setMostrarFormularioUsuario(false)}
        />
      )}

      {mostrarLoginAdmin && (
        <LoginAdmin
          onAuthenticated={() => {
            setAdminAutenticado(true);
            setMostrarLoginAdmin(false);
            setVista('admin');
            mostrarExito('Acceso autorizado', 'Bienvenido al panel de administración.');
          }}
          onCancelar={() => setMostrarLoginAdmin(false)}
        />
      )}

      <Footer
        categorias={categorias}
        setCategoriaActiva={(cat) => {
          setCategoriaActiva(cat);
          setVista('catalogo');
        }}
      />
    </div>
  );
}

export default App;