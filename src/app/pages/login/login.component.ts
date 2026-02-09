import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from '../../components/banner/banner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BannerComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  usuario = '';
  password = '';

  constructor(private router: Router) {}

  onSubmit(usuario: string, password: string): void {
    console.log('Usuario:', usuario);
    console.log('Password:', password);

    this.router.navigate(['/']);
  }
}
