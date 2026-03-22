import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';

import { UserService } from '../../services/user.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-user-edit.component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule, ButtonComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  id!: number;
  name = '';
  isActivateValue = false;
  originalActive = false;
  userTypes: any[] = [];

  form = this.formBuilder.group({
    userType: [null as number | null],
    activate: [null as boolean | null],
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserTypes().subscribe((types: any[]) => {
      this.userTypes = types;
      this.cdr.markForCheck();
    });

    this.loadUser();
  }

  loadUser() {
    this.userService.getById(this.id).subscribe((user: any) => {

      this.name = user.name;
      this.isActivateValue = !!user.active;
      this.originalActive = !!user.active;

      if (!this.originalActive) {
        this.form.get('userType')?.disable();
      }
    });
  }

  save() {
    if (this.loading) return;

    this.loading = true;

    const { userType: userTypeId, activate } = this.form.value;

    let requests: Observable<any>[] = [];
    
    if (activate !== null && activate !== this.originalActive) {
      requests.push(
        activate
          ? this.userService.activate(this.id)
          : this.userService.delete(this.id)
      );
    }

    if (userTypeId !== null && userTypeId !== undefined && (activate ?? this.originalActive)) {
      requests.push(
        this.userService.updateUserType(this.id, {
          idUserType: userTypeId
        })
      );
    }

    if (requests.length === 0) {
      this.loading = false;
      return;
    }

    forkJoin(requests).subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();

        if (activate != null) {
          this.originalActive = activate;
          this.isActivateValue = activate;
        }

        const selectedType = this.userTypes.find(t => t.id === userTypeId);

        this.showUpdateToast({
          title: 'Cadastro atualizado com sucesso!',
          name: this.name,
          info: `Atualizado ${
            selectedType ? `• ${selectedType.displayName}` : ''
          } ${
            activate !== null
              ? `• Status ${activate ? 'Ativo' : 'Inativo'}`
              : ''
          }`
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel() {
    this.router.navigate(['/users']);
  }

  showUpdateToast(data: any) {
    this.snackBar.openFromComponent(ToastComponent, {
      panelClass: 'custom-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: { 
        ...data,
        primaryAction: {
          label: 'Voltar para Usuários',
          type: 'list'
        },
        secondaryAction: null,
        onAction: (action: string) => {

          if (action === 'list') {
            this.ngZone.run(() => {
              this.router.navigate(['/users']);
            });
          }
        }
      }
    });
  }

}
