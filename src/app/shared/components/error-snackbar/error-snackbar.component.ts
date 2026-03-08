import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-snackbar.html',
  styleUrls: ['./error-snackbar.scss'],
})
export class ErrorSnackbarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string },
    private snackBarRef: MatSnackBarRef<ErrorSnackbarComponent>
  ) {}

  close(): void {
    this.snackBarRef.dismiss();
  }

}
