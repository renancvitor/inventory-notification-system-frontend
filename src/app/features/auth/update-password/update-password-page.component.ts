import { Component, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import {
  UpdatePasswordComponent,
  UpdatePasswordFormValue,
} from './update-password.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-update-password-page',
  standalone: true,
  imports: [UpdatePasswordComponent],
  templateUrl: './update-password-page.component.html',
  styleUrl: './update-password-page.component.scss',
})
export class UpdatePasswordPageComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  @ViewChild(UpdatePasswordComponent) updatePasswordComponent!: UpdatePasswordComponent;

  loading = false;

  updatePassword(data: UpdatePasswordFormValue) {
    const userId = this.authService.getCurrentUserId();
    const currentUser = this.authService.getCurrentUser();

    if (userId === null) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;

    this.userService.updatePassword(userId, data).subscribe({
      next: () => {
        this.loading = false;
        this.authService.clearFirstAccess();
        this.updatePasswordComponent.resetForm();

        this.snackBar.openFromComponent(ToastComponent, {
          panelClass: 'app-toast',
          horizontalPosition: 'center',
          verticalPosition: 'top',
          data: {
            title: 'Senha atualizada com sucesso!',
            name: currentUser?.personName ?? '',
            info: 'Sua senha foi alterada e já está ativa para os próximos acessos.',
            primaryAction: {
              label: 'Voltar para início',
              type: 'home',
            },
            secondaryAction: null,
            onAction: (action: string) => {
              if (action === 'home') {
                this.router.navigate(['/']);
              }
            },
          },
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
