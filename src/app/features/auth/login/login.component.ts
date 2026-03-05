import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  loginTest() {
    this.authService.login({
      email: 'admin@sistema.com',
      password: '123456',
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Login failed ', err)
    });
  }
}
