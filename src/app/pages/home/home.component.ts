import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { RistorinoResource } from '../../api/resources/ristorino-resource';
import { Promotion } from '../../api/resources/models/promotion.model';
import { RegistrarClickPromocionBody } from '../../api/resources/models/registrarClickPromocionBody.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent],
  providers: [RistorinoResource],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  promos: Promotion[] = [];

  constructor(private api: RistorinoResource) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.api.getPromociones().subscribe({
      next: (lista) => {
        console.log(lista);
        this.promos = lista ?? [];
      },
      error: (err) => console.error('Error al cargar promociones', err),
      complete: () => console.log('Carga completada'),
    });
  }

  onPromoClick(promo: Promotion): void {
    const registrarClickBody: RegistrarClickPromocionBody = {
      nroRestaurante: promo.nroRestaurante,
      nroIdioma: promo.nroIdioma,
      nroContenido: promo.nroContenido,
      nroCliente: 1,
    };

    this.api.registrarClickContenido(registrarClickBody).subscribe({
      next: (nroClick: number) => {
        console.log('Click registrado:', nroClick, 'promo:', promo);
      },
      error: (err) => {
        console.error('Error registrando click:', err);
      },
    });
  }
}
