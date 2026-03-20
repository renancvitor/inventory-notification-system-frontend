import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { PersonService } from '../../person.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

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

  loading = false;
  id!: number;
  personName = '';

  form = this.formBuilder.group({
    active: [true]
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPerson();
  }

  loadPerson() {
    this.personService.getById(this.id).subscribe((person: any) => {

      this.personName = person.personName;

      this.form.patchValue({
        active: person.active
      });
    });
  }

  save() {

    if (this.loading) return;

    this.loading = true;

    const active = this.form.value.active;

    const request = active
      ? this.personService.activate(this.id)
      : this.personService.delete(this.id);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/person']);
      },
      error: () => {
        this.loading = false;
      }
    });

  }

  cancel() {
    this.router.navigate(['/person']);
  }

}
