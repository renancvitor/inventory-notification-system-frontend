import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { UpdatePasswordComponent } from './update-password.component';

describe('UpdatePasswordComponent', () => {
  let component: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the form invalid when required fields are empty', () => {
    expect(component.form.invalid).toBe(true);

    const emitSpy = vi.spyOn(component.submitForm, 'emit');

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.form.controls.currentPassword.touched).toBe(true);
    expect(component.form.controls.newPassword.touched).toBe(true);
    expect(component.form.controls.confirmNewPassword.touched).toBe(true);
  });

  it('should leave password policy validation to the backend', () => {
    component.form.setValue({
      currentPassword: 'atual',
      newPassword: 'fraca',
      confirmNewPassword: 'diferente',
    });

    expect(component.form.valid).toBe(true);
  });

  it('should emit the form value when the form is valid', () => {
    const emitSpy = vi.spyOn(component.submitForm, 'emit');

    component.form.setValue({
      currentPassword: 'SenhaAtual123!',
      newPassword: 'NovaSenha123!',
      confirmNewPassword: 'NovaSenha123!',
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      currentPassword: 'SenhaAtual123!',
      newPassword: 'NovaSenha123!',
      confirmNewPassword: 'NovaSenha123!',
    });
  });
});
