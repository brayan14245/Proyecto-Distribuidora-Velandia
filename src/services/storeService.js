const STORAGE_KEY_USUARIOS = 'quickorder_usuarios';
const STORAGE_KEY_CARRITO = 'quickorder_carrito';

const storageAvailable = () => {
  if (typeof window === 'undefined') return false;
  return !!window.localStorage;
};

export const obtenerUsuarios = (storageKey = STORAGE_KEY_USUARIOS) => {
  if (!storageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error al leer usuarios:', error);
    return [];
  }
};

export const guardarUsuarios = (usuarios, storageKey = STORAGE_KEY_USUARIOS) => {
  if (!storageAvailable()) return usuarios;

  window.localStorage.setItem(storageKey, JSON.stringify(usuarios));
  return usuarios;
};

export const crearUsuario = (usuario, storageKey = STORAGE_KEY_USUARIOS) => {
  const usuarios = obtenerUsuarios(storageKey);
  const nuevoUsuario = {
    id: Date.now(),
    ...usuario,
    fechaCreacion: new Date().toISOString(),
  };

  const actualizados = [...usuarios, nuevoUsuario];
  guardarUsuarios(actualizados, storageKey);
  return nuevoUsuario;
};

export const obtenerCarrito = (storageKey = STORAGE_KEY_CARRITO) => {
  if (!storageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error al leer carrito:', error);
    return [];
  }
};

export const guardarCarrito = (carrito, storageKey = STORAGE_KEY_CARRITO) => {
  if (!storageAvailable()) return carrito;

  window.localStorage.setItem(storageKey, JSON.stringify(carrito));
  return carrito;
};

export const agregarAlCarrito = (carrito = [], producto, maxStock, cantidad = 1) => {
  if (!producto || !producto.id) return carrito;

  const cantidadSolicitada = Number(cantidad) || 1;
  const stockDisponible = Number(maxStock ?? producto.stock ?? 0);
  const itemExistente = carrito.find((item) => item.id === producto.id);

  if (itemExistente) {
    const cantidadSiguiente = itemExistente.cantidad + cantidadSolicitada;
    if (stockDisponible > 0 && cantidadSiguiente > stockDisponible) {
      return carrito;
    }

    return carrito.map((item) =>
      item.id === producto.id
        ? { ...item, cantidad: cantidadSiguiente }
        : item
    );
  }

  if (stockDisponible > 0 && cantidadSolicitada > stockDisponible) {
    return carrito;
  }

  return [...carrito, { ...producto, cantidad: cantidadSolicitada }];
};

export const quitarDelCarrito = (carrito = [], productoId) => {
  return carrito
    .map((item) =>
      item.id === productoId
        ? { ...item, cantidad: item.cantidad - 1 }
        : item
    )
    .filter((item) => item.cantidad > 0);
};

export const calcularTotalCarrito = (carrito = []) => {
  return carrito.reduce((total, item) => total + (Number(item.precio) || 0) * (Number(item.cantidad) || 0), 0);
};

export const generarActualizacionesStock = (productos = [], itemsCarrito = []) => {
  return productos
    .map((producto) => {
      const item = itemsCarrito.find((entry) => Number(entry.id) === Number(producto.id));

      if (!item) return null;

      const cantidadSolicitada = Number(item.cantidad) || 0;
      const stockActual = Number(producto.stock) || 0;

      return {
        ...producto,
        stock: Math.max(stockActual - cantidadSolicitada, 0),
      };
    })
    .filter(Boolean);
};

export const descontarStockProductos = (productos = [], itemsCarrito = []) => {
  return generarActualizacionesStock(productos, itemsCarrito);
};
