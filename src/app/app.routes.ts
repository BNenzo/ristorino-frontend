import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetalleRestauranteComponent } from './pages/detalle-restaurante/detalle-restaurante';
import { promocionesResolver } from './resolvers/promociones/promociones-resolver';
import { RistorinoResource } from './api/resources/ristorino-resource';
import {
  datosRestauranteResolver,
  preferenciasRestauranteResolver,
  sucursalesResolver,
} from './resolvers/datos-restaurante/datos-restaurante-resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { promociones: promocionesResolver },
    providers: [RistorinoResource],
  },
  {
    path: 'restaurante/:nro_restaurante',
    component: DetalleRestauranteComponent,
    resolve: {
      datosRestaurante: datosRestauranteResolver,
      sucursales: sucursalesResolver,
      preferencias: preferenciasRestauranteResolver,
    },
    providers: [RistorinoResource],
  },
];
