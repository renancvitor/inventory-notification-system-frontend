import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/auth/auth.service';
import { HeaderComponent } from './shared/layout/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {

  protected readonly title = signal('inventory-notification-system-frontend');

  constructor(public authService: AuthService) {}
}
