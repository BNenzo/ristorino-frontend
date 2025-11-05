import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { RistorinoResource } from '../../api/resources/ristorino-resource';
import { Promotion } from '../../api/resources/models/promotion.model';

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
}
