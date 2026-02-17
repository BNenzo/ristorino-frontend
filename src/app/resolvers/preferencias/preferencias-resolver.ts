import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { PreferenciaResource } from '../../api/resources/preferencia/preferencia-resource';
import { PreferenciaResponse } from '../../api/resources/preferencia/models/preferencia.model';

export const preferenciasResolver: ResolveFn<PreferenciaResponse[]> = () => {
  return inject(PreferenciaResource).getPreferencias();
};
