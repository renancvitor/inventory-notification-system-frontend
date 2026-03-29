import { Component, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonService } from '../../services/person.service';
import { PersonDetail } from '../../services/person.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { ToastData } from '../../../../shared/services/toast.model';

@Component({
  selector: 'app-person-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent, MatFormFieldModule, MatSelectModule],
  templateUrl: './person-edit.component.html',
  styleUrl: './person-edit.component.scss',
})
export class PersonEditComponent {

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private personService = inject(PersonService);
  private snackBar = inject(MatSnackBar);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  
  loading = false;
  id!: number;
  personName = '';
  isActiveValue = false;

  form = this.formBuilder.group({
    active: [true]
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.form.get('active')?.valueChanges.subscribe(value => {
      this.isActiveValue = !!value;
    });
    
    this.loadPerson();
  }

  loadPerson() {
    this.personService.getById(this.id).subscribe((person: PersonDetail) => {

      this.personName = person.personName;

      this.form.patchValue({
        active: person.active
      });

      this.isActiveValue = !!person.active;
    });
  }

  save() {

    if (this.loading) return;

    this.loading = true;

    const active = this.form.get('active')?.value ?? false;

    const request = active
      ? this.personService.activate(this.id)
      : this.personService.delete(this.id);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.cdr.detectChanges();
        
        this.showUpdateToast({
          title: 'Cadastro atualizado com sucesso',
          name: this.personName,
          info: 'Status alterado para ' + (active ? 'Ativo' : 'Inativo')
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

  }

  cancel() {
    this.router.navigate(['/person']);
  }

  showUpdateToast(data: Pick<ToastData, 'title' | 'name' | 'info'>) {

    this.snackBar.openFromComponent(ToastComponent, {
      panelClass: 'app-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: { 
        ...data,
        primaryAction: {
          label: 'Voltar para Pessoas',
          type: 'list'
        },
        secondaryAction: null,
        onAction: (action: string) => {

          if (action === 'list') {
            this.ngZone.run(() => {
              this.router.navigate(['/person']);
            });
          }
        }
      }
    });

  }

}
