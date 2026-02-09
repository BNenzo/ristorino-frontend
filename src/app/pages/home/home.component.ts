import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { RistorinoResource } from '../../api/resources/ristorino-resource';
import { Promotion } from '../../api/resources/contenido/models/promotion.model';
import { RegistrarClickPromocionBody } from '../../api/resources/contenido/models/registrarClickPromocionBody.model';
import { ActivatedRoute } from '@angular/router';
import { BannerComponent } from '../../components/banner/banner.component';
import { ContenidoResource } from '../../api/resources/contenido/contenido-resource';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BannerComponent, RestaurantCardComponent, NavbarComponent],
  providers: [RistorinoResource],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  promos: Promotion[] = [];
  constructor(
    private _route: ActivatedRoute,
    private contenidoApi: ContenidoResource,
  ) {}

  ngOnInit(): void {
    this._route.data.subscribe((data) => {
      this.promos = data['promociones'];
    });
    console.log(this.promos);
  }

  onPromoClick(promo: Promotion): void {
    const registrarClickBody: RegistrarClickPromocionBody = {
      nroRestaurante: promo.nroRestaurante,
      nroIdioma: promo.nroIdioma,
      nroContenido: promo.nroContenido,
      nroCliente: 1,
      costoClick: promo.costoClick,
      codContenidoRestaurante: promo.codContenidoRestaurante,
    };

    this.contenidoApi.registrarClickContenido(registrarClickBody).subscribe({
      next: (nroClick: number) => {
        console.log('Click registrado:', nroClick, 'promo:', promo);
      },
      error: (err) => {
        console.error('Error registrando click:', err);
      },
    });
  }
}
