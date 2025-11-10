import { ResolveFn } from '@angular/router';
import { Restaurant } from '../../api/resources/models/restaurant.model';
import { RistorinoResource } from '../../api/resources/ristorino-resource';
import { inject } from '@angular/core';
import { Sucursal } from '../../api/resources/models/sucursal.model';
import { PreferenciaRestaurante } from '../../api/resources/models/preferencia-restaurante.model';

export const datosRestauranteResolver: ResolveFn<Restaurant> = (route, state) => {
  return inject(RistorinoResource).getDatosRestaurante({
    nroRestaurante: route.params['nro_restaurante'],
  });
};

export const sucursalesResolver: ResolveFn<Sucursal[]> = (route, state) => {
  return inject(RistorinoResource).getSucursalesRestaurante({
    nroRestaurante: route.params['nro_restaurante'],
  });
};

export const preferenciasRestauranteResolver: ResolveFn<PreferenciaRestaurante[]> = (route) => {
  return inject(RistorinoResource).getPreferenciasRestaurante({
    nroRestaurante: route.params['nro_restaurante'],
  });
};
