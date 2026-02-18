import { ReservaCliente } from '../../../api/resources/reserva/models/reserva-cliente.model';
import { ObtenerReservasCliente } from '../../../api/resources/reservas/models/obtener-reservas-cliente.model';

export const puedeEditarReserva = ({
  codEstado,
  fechaCancelacion,
  fechaReserva,
  horaReserva,
}: Pick<
  ObtenerReservasCliente,
  'codEstado' | 'fechaReserva' | 'horaReserva' | 'fechaCancelacion'
>): boolean => {
  if (fechaCancelacion) return false;

  if (codEstado !== 'PEN') return false;

  const dtReserva = new Date(`${fechaReserva}T${horaReserva}`);

  if (isNaN(dtReserva.getTime())) return false;

  const ahora = new Date();
  const diffMs = dtReserva.getTime() - ahora.getTime();
  const diffHoras = diffMs / (1000 * 60 * 60);
  return diffHoras >= 8;
};
