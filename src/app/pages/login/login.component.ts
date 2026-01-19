import { Component } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';

@Component({
  selector: 'app-login',
  imports: [BannerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {}
