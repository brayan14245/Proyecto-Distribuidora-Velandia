const API_URL = 'https://6aa6a919d7765db985078096.mockapi.io/banner';

export const obtenerBanners = () => {
  return fetch(API_URL)
    .then((response) => {
      if (!response.ok) throw new Error('No se pudieron obtener los banners');
      return response.json();
    });
};

export const crearBanner = (banner) => {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(banner),
  }).then((response) => {
    if (!response.ok) throw new Error('No se pudo crear el banner');
    return response.json();
  });
};

export const actualizarBanner = (id, banner) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(banner),
  }).then((response) => {
    if (!response.ok) throw new Error('No se pudo actualizar el banner');
    return response.json();
  });
};

export const eliminarBanner = (id) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) throw new Error('No se pudo eliminar el banner');
    return response.json();
  });
};
