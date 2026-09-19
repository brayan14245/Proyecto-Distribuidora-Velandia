const API_URL = 'https://6aa6a919d7765db985078096.mockapi.io/orden';

export const obtenerOrdenes = () => {
  return fetch(API_URL)
    .then((response) => {
      if (!response.ok) throw new Error('No se pudieron obtener las órdenes');
      return response.json();
    });
};

export const obtenerOrdenesPorUsuario = async (usuarioId) => {
  const ordenes = await obtenerOrdenes();
  return ordenes.filter((orden) => String(orden.usuarioId) === String(usuarioId));
};

export const crearOrden = (orden) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orden),
  }).then((response) => {
    if (!response.ok) throw new Error('No se pudo crear la orden');
    return response.json();
  });
};

export const actualizarOrden = (id, orden) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orden),
  }).then((response) => {
    if (!response.ok) throw new Error('No se pudo actualizar la orden');
    return response.json();
  });
};

export const eliminarOrden = (id) => {
  return fetch(`${API_URL}/${id}`, { method: 'DELETE' }).then((response) => {
    if (!response.ok) throw new Error('No se pudo eliminar la orden');
    return response.json();
  });
};
