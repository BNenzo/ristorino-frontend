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
import { Usuario } from './models/usuario.model';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class AuthResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/auth/login',
    method: ResourceRequestMethod.Post,
  })
  declare login: IResourceMethodObservable<{ email: string; clave: string }, { token: string }>;

  @ResourceAction({
    path: '/auth/me',
    method: ResourceRequestMethod.Get,
  })
  declare me: IResourceMethodObservable<void, Usuario>;
}
