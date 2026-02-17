import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Loader } from './components/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {}
