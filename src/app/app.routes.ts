import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetalleRestauranteComponent } from './pages/detalle-restaurante/detalle-restaurante';
import { promocionesResolver } from './resolvers/promociones/promociones-resolver';
import { RistorinoResource } from './api/resources/ristorino-resource';
import { ReservarComponent } from './pages/reservar/reservar.component';
import {
  restaurantesResolver,
  datosRestauranteResolver,
  preferenciasRestauranteResolver,
  sucursalesResolver,
} from './resolvers/restaurantes/restaurantes-resolver';
import { RestauranteResource } from './api/resources/restaurante/restaurante-resource';
import { ReservaResource } from './api/resources/reserva/reserva-resource';
import { ContenidoResource } from './api/resources/contenido/contenido-resource';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { promociones: promocionesResolver },
    providers: [ContenidoResource],
  },
  {
    path: 'restaurante/:nro_restaurante',
    component: DetalleRestauranteComponent,
    resolve: {
      datosRestaurante: datosRestauranteResolver,
      sucursales: sucursalesResolver,
      preferencias: preferenciasRestauranteResolver,
    },
    providers: [RestauranteResource],
  },
  {
    path: 'reservar',
    component: ReservarComponent,
    resolve: {
      restaurantes: restaurantesResolver,
    },
    providers: [RestauranteResource, ReservaResource],
  },
];
