const API_URL = 'https://6aa6a919d7765db985078096.mockapi.io/producto';

// Obtener todos los productos
export const obtenerProductos = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};

// Crear un nuevo producto
export const crearProducto = (producto) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  }).then((response) => response.json());
};

// Actualizar un producto existente
export const actualizarProducto = (id, producto) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  }).then((response) => response.json());
};

// Eliminar un producto por ID
export const eliminarProducto = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then((response) => response.json());
};
