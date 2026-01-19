import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
} from '@ngx-resource/core';
import type { IResourceMethodObservable } from '@ngx-resource/core';

import { environment } from '../../../enviroments/enviroment.development';
import { Cliente } from './models/cliente.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class ClientesResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/clientes',
    method: ResourceRequestMethod.Post,
  })
  declare registrarCliente: IResourceMethodObservable<Cliente, void>;
}
