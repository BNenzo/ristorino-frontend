import { TEstadoReserva } from '../../types';

const ESTADOS_COLORES = {
  PEN: {
    color_texto_estado: 'color_texto_estado_pendiente',
  },
  CONF: {
    color_texto_estado: 'color_texto_estado_confirmado',
  },
  COMP: {
    color_texto_estado: 'color_texto_estado_completado',
  },
  CAN: {
    color_texto_estado: 'color_texto_estado_cancelado',
  },
};

export const obtenerTextoEstadoClassname = (estado: TEstadoReserva) => {
  console.log(estado);
  return ESTADOS_COLORES[estado].color_texto_estado;
};
