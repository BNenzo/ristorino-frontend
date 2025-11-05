import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Promotion } from '../../api/resources/models/promotion.model';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.scss',
})
export class RestaurantCardComponent {
  @Input() promotion!: Promotion;

  // Emite el evento al hacer click
  @Output() cardClick = new EventEmitter<Promotion>();

  onCardClick(): void {
    this.cardClick.emit(this.promotion);
  }
}
