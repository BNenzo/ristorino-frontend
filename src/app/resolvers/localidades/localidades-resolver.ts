import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { LocalidadResource } from '../../api/resources/localidad/localidad-resource';
import { LocalidadResponse } from '../../api/resources/localidad/models/localidad.model';

export const localidadesResolver: ResolveFn<LocalidadResponse[]> = () => {
  return inject(LocalidadResource).getLocalidades();
};
