const API_URL = 'https://6aa6a919d7765db985078096.mockapi.io/categoria';

// Obtener todas las categorías
export const obtenerCategorias = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};

// Crear una nueva categoría
export const crearCategoria = (categoria) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoria)
  }).then((response) => response.json());
};

// Actualizar una categoría existente
export const actualizarCategoria = (id, categoria) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoria)
  }).then((response) => response.json());
};

// Eliminar una categoría por ID
export const eliminarCategoria = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  }).then((response) => response.json());
};
