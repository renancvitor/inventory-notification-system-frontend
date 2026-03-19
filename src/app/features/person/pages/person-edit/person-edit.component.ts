import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-person-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './person-edit.component.html',
  styleUrl: './person-edit.component.scss',
})
export class PersonEditComponent {

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.formBuilder.group({
    active: [true]
  });

  save() {}

  cancel() {
    this.router.navigate(['/person']);
  }
}
