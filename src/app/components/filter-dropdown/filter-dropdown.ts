import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-filter-dropdown',
  imports: [CommonModule],
  templateUrl: './filter-dropdown.html',
  styleUrl: './filter-dropdown.scss',
})
export class FilterDropdown {
  isOpen = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }
}
