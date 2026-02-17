import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
} from '@ngx-resource/core';
import { environment } from '../../../../enviroments/enviroment.development';
import { Idiomas } from './models/idiomas.model';
import type { IResourceMethodObservable } from '@ngx-resource/core';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class IdiomasResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }

  @ResourceAction({
    path: '/idiomas',
    method: ResourceRequestMethod.Get,
  })
  declare getIdiomas: IResourceMethodObservable<void, Idiomas[]>;
}
