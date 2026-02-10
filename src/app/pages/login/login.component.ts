import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from '../../components/banner/banner.component';
import { AuthResource } from '../../api/resources/auth/auth-resource';
import { SessionStore } from '../../store/session-store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BannerComponent, FormsModule],
  providers: [AuthResource],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  usuario = '';
  password = '';

  constructor(
    private router: Router,
    private authApi: AuthResource,
    private authStore: SessionStore,
  ) {}

  onSubmit(email: string, clave: string): void {
    this.authApi.login({ email, clave }).subscribe({
      next: ({ token }) => {
        this.authStore.setToken(token);
        this.authApi.me().subscribe({
          next: (user) => {
            this.authStore.setUser(user);
            this.router.navigate(['/']);
          },
        });
      },
    });
  }
}
