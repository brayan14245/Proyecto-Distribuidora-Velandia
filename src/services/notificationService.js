import Swal from 'sweetalert2';

const opcionesBase = {
  confirmButtonColor: '#7e6bdb',
  cancelButtonColor: '#6b7280',
  background: '#ffffff',
  color: '#2b233d',
  customClass: {
    popup: 'quickorder-alert',
  },
};

export const mostrarExito = (titulo, texto = '') => {
  return Swal.fire({
    ...opcionesBase,
    icon: 'success',
    title: titulo,
    text: texto,
    confirmButtonText: 'Aceptar',
  });
};

export const mostrarError = (titulo, texto = '') => {
  return Swal.fire({
    ...opcionesBase,
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'Entendido',
  });
};

export const mostrarAdvertencia = (titulo, texto = '') => {
  return Swal.fire({
    ...opcionesBase,
    icon: 'warning',
    title: titulo,
    text: texto,
    confirmButtonText: 'Aceptar',
  });
};

export const confirmarAccion = async (titulo, texto) => {
  const resultado = await Swal.fire({
    ...opcionesBase,
    icon: 'question',
    title: titulo,
    text: texto,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
  });

  return resultado.isConfirmed;
};
