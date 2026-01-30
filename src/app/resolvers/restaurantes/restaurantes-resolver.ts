import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Restaurante } from '../../api/resources/restaurante/models/restaurante.model';
import { Restaurant } from '../../api/resources/restaurante/models/restaurant.model';
import { Sucursal } from '../../api/resources/restaurante/models/sucursal.model';
import { PreferenciaRestaurante } from '../../api/resources/restaurante/models/preferencia-restaurante.model';
import { RestauranteResource } from '../../api/resources/restaurante/restaurante-resource';

export const restaurantesResolver: ResolveFn<Restaurante[]> = () => {
  return inject(RestauranteResource).getRestaurantes();
};

export const datosRestauranteResolver: ResolveFn<Restaurant> = (route, state) => {
  return inject(RestauranteResource).getDatosRestaurante({
    nroRestaurante: route.params['nro_restaurante'],
  });
};

export const sucursalesResolver: ResolveFn<Sucursal[]> = (route, state) => {
  return inject(RestauranteResource).getSucursalesRestaurante({
    nroRestaurante: route.params['nro_restaurante'],
  });
};

export const preferenciasRestauranteResolver: ResolveFn<PreferenciaRestaurante[]> = (route) => {
  return inject(RestauranteResource).getPreferenciasRestaurante({
    nroRestaurante: route.params['nro_restaurante'],
  });
};
