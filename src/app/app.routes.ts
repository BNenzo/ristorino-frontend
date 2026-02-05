import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetalleRestauranteComponent } from './pages/detalle-restaurante/detalle-restaurante';
import { promocionesResolver } from './resolvers/promociones/promociones-resolver';
import { RistorinoResource } from './api/resources/ristorino-resource';
import { ReservarComponent } from './pages/reservar/reservar.component';

import { MisReservas } from './pages/mis-reservas/mis-reservas';
import { ReservasResource } from './api/resources/reservas/reservas-resource';
import {
  obtenerEstadosReservasResolver,
  obtenerReservaClienteResolver,
  obtenerReservasClienteResolver,
} from './resolvers/reservas/reservas-resolver';
import { ContenidoResource } from './api/resources/contenido/contenido-resource';
import { RestauranteResource } from './api/resources/restaurante/restaurante-resource';
import { ReservaResource } from './api/resources/reserva/reserva-resource';
import {
  datosRestauranteResolver,
  preferenciasRestauranteResolver,
  restaurantesResolver,
  sucursalesResolver,
} from './resolvers/restaurantes/restaurantes-resolver';
import { EditarReserva } from './pages/editar-reserva/editar-reserva';

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
  {
    path: 'mis-reservas',
    component: MisReservas,
    resolve: {
      reservas: obtenerReservasClienteResolver,
      estadosReserva: obtenerEstadosReservasResolver,
    },
    providers: [ReservasResource, ReservaResource],
  },
  {
    path: 'editar-reserva/:nro_reserva',
    component: EditarReserva,
    resolve: {
      reserva: obtenerReservaClienteResolver,
    },
    providers: [ReservaResource],
  },
];
