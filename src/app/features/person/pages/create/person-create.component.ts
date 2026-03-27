import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonFormComponent } from '../../components/form/person-form.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-person-create.component',
  standalone: true,
  imports: [PersonFormComponent],
  templateUrl: './person-create.component.html',
  styleUrls: ['./person-create.component.scss'],
})
export class PersonCreateComponent {

  constructor(private personService: PersonService, private router: Router, private snackBar: MatSnackBar) {}

  @ViewChild(PersonFormComponent) personFormComponent!: PersonFormComponent;

  loading = false;

  createPerson(personData: any) {

    this.loading = true;

    const payload = {
      person: personData,
      user: null
    };

    this.personService.create(payload).subscribe({
      next: (person) => {
        this.loading = false;
        this.personFormComponent.resetForm();
        this.showSuccessToast({
          title: 'Cadastro realizado com sucesso',
          name: person.personName,
          info: `${person.cpf} • ${person.email} • registrado agora`
        });
      },
      error: (error) => {
        this.loading = false;
      }
    });

  }

  cancel() {
    this.router.navigate(['/person']);
  }

  showSuccessToast(data: any) {

    this.snackBar.openFromComponent(ToastComponent, {
      panelClass: 'app-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: { 
        ...data,
        primaryAction: {
          label: 'Cadastrar outra',
          type: 'new'
        },
        secondaryAction: {
          label: 'Voltar para Pessoas',
          type: 'list'
        },
        onAction: (action: string) => {

          if (action === 'list') {
            this.router.navigate(['/person']);
          }

          if (action === 'new') {
            this.personFormComponent.resetForm();
          }

        }
      }
    });

  }

}
