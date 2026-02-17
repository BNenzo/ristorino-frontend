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
import { RegistrarClienteConPreferenciasRequest } from './models/registrarClienteConPreferencias.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class ClienteResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/registrar',
    method: ResourceRequestMethod.Post,
  })
  declare registrar: IResourceMethodObservable<
    RegistrarClienteConPreferenciasRequest,
    { nroCliente: number }
  >;
}
