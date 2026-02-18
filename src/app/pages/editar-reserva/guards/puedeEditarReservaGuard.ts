import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ObtenerReservasCliente } from '../../../api/resources/reservas/models/obtener-reservas-cliente.model';
import { puedeEditarReserva } from '../utils';

export const puedeEditarReservaGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const reserva = route.data['reserva'] as ObtenerReservasCliente | undefined;

  if (!reserva) {
    console.log('llego hasta ca');
    router.navigate(['/mis-reservas']);
    return false;
  }

  return puedeEditarReserva(reserva as ObtenerReservasCliente);
};
