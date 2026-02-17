import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader-service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  constructor(public loader: LoaderService) {}
}
