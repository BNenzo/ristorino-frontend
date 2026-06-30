import { ResolveFn } from '@angular/router';
import { Promotion } from '../../api/resources/contenido/models/promotion.model';
import { inject } from '@angular/core';
import { ContenidoResource } from '../../api/resources/contenido/contenido-resource';

/*
  OBTENER LAS PROMOCIONES DE TODOS LOS RESTAURANTES - SE USA EN LA HOME PAGE
*/
export const promocionesResolver: ResolveFn<Promotion[]> = (route, state) => {
  return inject(ContenidoResource).getPromociones();
};

/*
  OBTENER LAS PROMOCIONES DE UN RESTAURANTE - SE USA EN DETALLE DE RESTAURANTE
*/
export const promocionesRestauranteResolver: ResolveFn<Promotion[]> = (route, state) => {
  const nroRestaurante = route.params['nro_restaurante'];
  return inject(ContenidoResource).getPromociones({ nroRestaurante });
};
