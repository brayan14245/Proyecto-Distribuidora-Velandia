const API_URL = 'https://6aa6a919d7765db985078096.mockapi.io/usuario';

const readLocalFallback = () => {
  try {
    const raw = window.localStorage.getItem('quickorder_usuarios_fallback');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const saveLocalFallback = (usuarios) => {
  try {
    window.localStorage.setItem('quickorder_usuarios_fallback', JSON.stringify(usuarios));
  } catch (error) {
    // Ignorar si no hay almacenamiento disponible
  }
};

export const obtenerUsuarios = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('No se pudo obtener usuarios');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    const fallback = readLocalFallback();
    return fallback;
  }
};

export const guardarUsuarios = async (usuarios) => {
  try {
    // No se usa en la app porque la creación de usuarios se hace con POST
    saveLocalFallback(usuarios);
    return usuarios;
  } catch (error) {
    return usuarios;
  }
};

export const crearUsuario = async (usuario) => {
  const payload = {
    id: Date.now(),
    ...usuario,
    fechaCreacion: new Date().toISOString(),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('No se pudo crear el usuario');

    const nuevoUsuario = await response.json();
    saveLocalFallback([...(await obtenerUsuarios()), nuevoUsuario]);
    return nuevoUsuario;
  } catch (error) {
    const usuarios = readLocalFallback();
    const localUser = { ...payload, id: String(Date.now()) };
    const actualizados = [...usuarios, localUser];
    saveLocalFallback(actualizados);
    return localUser;
  }
};
