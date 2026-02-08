import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  loginTest() {
    this.authService
      .login({
        email: 'admin@sistema.com',
        password: '123456',
      })
      .subscribe({
        next: (response) => console.log('Backend response: ', response),
        error: (error) => console.log('Error: ', error),
      });
  }

  usersTest() {
    this.authService
      .getUsers().subscribe({
        next: response => console.log('Users: ', response),
        error: error => console.log('Error: ', error)                
      });
  }
}
