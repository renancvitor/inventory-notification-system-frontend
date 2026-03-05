import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../shared/components/button/button.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatCardModule, MatInputModule, ButtonComponent],
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
