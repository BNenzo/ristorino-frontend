import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
} from '@ngx-resource/core';
import { environment } from '../../../../enviroments/enviroment.development';
import type { IResourceMethodObservable } from '@ngx-resource/core';
import { PreferenciaResponse } from './models/preferencia.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class PreferenciaResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/preferencias',
    method: ResourceRequestMethod.Get,
  })
  declare getPreferencias: IResourceMethodObservable<void, PreferenciaResponse[]>;
}
