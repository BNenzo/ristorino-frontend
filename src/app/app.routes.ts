import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetalleRestauranteComponent } from './pages/detalle-restaurante/detalle-restaurante';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'restaurante/:nro_restaurante', component: DetalleRestauranteComponent },
];
