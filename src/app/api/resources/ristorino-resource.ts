import { Injectable } from '@angular/core';
import {
  Resource,
  ResourceAction,
  ResourceHandler,
  ResourceParams,
  ResourceRequestMethod,
} from '@ngx-resource/core';
import { environment } from '../../../enviroments/enviroment.development';
import type { IResourceMethodObservable } from '@ngx-resource/core';

@Injectable()
@ResourceParams({
  pathPrefix: `${environment.apiUrl}/ristorino`,
})
export class RistorinoResource extends Resource {
  constructor(handler: ResourceHandler) {
    super(handler);
  }
  @ResourceAction({
    path: '/promociones',
    method: ResourceRequestMethod.Get,
  })
  declare getPromociones: IResourceMethodObservable<void, any>;
}
