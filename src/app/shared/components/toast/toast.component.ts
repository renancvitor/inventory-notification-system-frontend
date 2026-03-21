import { Component, Inject, HostListener } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<ToastComponent>
  ) {}

  @HostListener('document:keydown.escape') handleEscape() {
    this.snackBarRef.dismiss();
  }

  close() {
    this.snackBarRef.dismiss();
  }

  action(action: string) {
    this.data.onAction(action);
    this.snackBarRef.dismiss();
  }

}
