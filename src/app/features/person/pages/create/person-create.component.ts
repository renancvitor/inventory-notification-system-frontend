import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PersonService } from '../../person.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonFormComponent } from '../../components/form/person-form/person-form.component';

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
        this.showSuccessToast(person);
      },
      error: (error) => {
        this.loading = false;
      }
    });

  }

  cancel() {
    this.router.navigate(['/person']);
  }

  showSuccessToast(person: any) {

    const snackBarRef = this.snackBar.open('Pessoa cadastrada com sucesso',
      'Ver lista',
      { duration: 5000 }
    );

    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/person']);
    });
  }

}
