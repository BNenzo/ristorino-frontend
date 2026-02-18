import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetalleRestauranteComponent } from './pages/detalle-restaurante/detalle-restaurante';
import { promocionesResolver } from './resolvers/promociones/promociones-resolver';
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
import { LoginComponent } from './pages/login/login.component';
import { RegistrarseComponent } from './pages/registrarse/registrarse.component';
import { ClienteResource } from './api/resources/cliente/cliente-resource';
import { LocalidadResource } from './api/resources/localidad/localidad-resource';
import { PreferenciaResource } from './api/resources/preferencia/preferencia-resource';
import { localidadesResolver } from './resolvers/localidades/localidades-resolver';
import { preferenciasResolver } from './resolvers/preferencias/preferencias-resolver';
import { puedeEditarReservaGuard } from './pages/editar-reserva/guards/puedeEditarReservaGuard';

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
      promociones: promocionesResolver,
    },
    providers: [RestauranteResource, ContenidoResource],
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
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registrarse',
    component: RegistrarseComponent,
    resolve: {
      localidades: localidadesResolver,
      preferencias: preferenciasResolver,
    },
    providers: [ClienteResource, LocalidadResource, PreferenciaResource],
  },
];
