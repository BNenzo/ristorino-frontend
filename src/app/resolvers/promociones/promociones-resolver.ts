import { ResolveFn } from '@angular/router';
import { Promotion } from '../../api/resources/models/promotion.model';
import { inject } from '@angular/core';
import { RistorinoResource } from '../../api/resources/ristorino-resource';

export const promocionesResolver: ResolveFn<Promotion[]> = (route, state) => {
  return inject(RistorinoResource).getPromociones();
};
