import { ResolveFn } from '@angular/router';
import { Promotion } from '../../api/resources/contenido/models/promotion.model';
import { inject } from '@angular/core';
import { ContenidoResource } from '../../api/resources/contenido/contenido-resource';

export const promocionesResolver: ResolveFn<Promotion[]> = (route, state) => {
  return inject(ContenidoResource).getPromociones();
};
