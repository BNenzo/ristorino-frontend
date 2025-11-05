import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';
import { RistorinoResource } from '../../api/resources/ristorino-resource';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent],
  providers: [RistorinoResource],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  cards = Array(8).fill(null);

  promos: any[] = [];
  constructor(private api: RistorinoResource) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.api.getPromociones().subscribe({
      next: (lista: any[]) => {
        console.log(lista);
        this.promos = lista ?? [];
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('completado');
      },
    });
  }
}
