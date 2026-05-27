import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from '../../components/banner/banner.component';
import { AuthResource } from '../../api/resources/auth/auth-resource';
import { SessionStore } from '../../store/session-store';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [BannerComponent, FormsModule, RouterModule],
  providers: [AuthResource],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  usuario = '';
  password = '';
  returnUrl = '/';

  constructor(
    private router: Router,
    private authApi: AuthResource,
    private authStore: SessionStore,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('redirectTo') ?? '/';
  }

  onSubmit(email: string, clave: string): void {
    this.authApi.login({ email, clave }).subscribe({
      next: ({ token }) => {
        this.authStore.setToken(token);
        this.authApi.me().subscribe({
          next: (user) => {
            this.authStore.setUser(user);
            this.router.navigateByUrl(this.returnUrl);
          },
        });
      },
    });
  }
}
