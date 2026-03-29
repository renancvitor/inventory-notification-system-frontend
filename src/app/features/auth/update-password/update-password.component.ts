import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { UpdatePasswordFormValue } from '../services/update-password.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#?&])[A-Za-z\d@$!%#?&]{8,}$/;

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword')?.value;
  const confirmNewPassword = control.get('confirmNewPassword')?.value;

  if (!newPassword || !confirmNewPassword) {
    return null;
  }

  return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ButtonComponent,
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent {
  private formBuilder = inject(FormBuilder);

  @Input() loading = false;
  @Input() title = 'Atualizar senha';
  @Input() description = 'Confirme sua senha atual e escolha uma nova senha segura.';
  @Input() submitLabel = 'Salvar nova senha';
  @Input() cancelLabel = 'Cancelar';
  @Input() showCancelButton = true;

  @Output() submitForm = new EventEmitter<UpdatePasswordFormValue>();
  @Output() cancel = new EventEmitter<void>();

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmNewPassword = true;

  readonly passwordRules = [
    'Mínimo de 8 caracteres.',
    'Pelo menos 1 letra maiúscula.',
    'Pelo menos 1 letra minúscula.',
    'Pelo menos 1 número.',
    'Pelo menos 1 caractere especial entre @$!%#?&.',
  ];

  readonly form = this.formBuilder.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD_REGEX)]],
      confirmNewPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator }
  );

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.submitForm.emit({
      currentPassword: value.currentPassword ?? '',
      newPassword: value.newPassword ?? '',
      confirmNewPassword: value.confirmNewPassword ?? '',
    });
  }

  resetForm() {
    this.form.reset();
  }

  toggleCurrentPasswordVisibility() {
    this.hideCurrentPassword = !this.hideCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword = !this.hideNewPassword;
  }

  toggleConfirmNewPasswordVisibility() {
    this.hideConfirmNewPassword = !this.hideConfirmNewPassword;
  }

  isPasswordMismatch() {
    const control = this.form.controls.confirmNewPassword;

    return this.form.hasError('passwordMismatch') && (control.touched || control.dirty);
  }
}
