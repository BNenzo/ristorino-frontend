import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Promotion } from '../../api/resources/models/promotion.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.scss',
})
export class RestaurantCardComponent {
  @Input() promotion!: Promotion;
}
