import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ButtonComponent } from '../../../../../shared/components/button/button.component';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, ButtonComponent],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
})
export class PersonFormComponent {

  @Output() submitForm = new EventEmitter<{
    personName: string;
    email: string;
    cpf: string;
  }>();
  @Output() cancel = new EventEmitter<void>();
  @Input() loading = false;

  private formBuilder = inject(FormBuilder);

  personForm = this.formBuilder.nonNullable.group({
    personName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', Validators.required],
  });

  onSubmit() {
    if (this.personForm.invalid) return;

    this.submitForm.emit(this.personForm.getRawValue());
  }

  resetForm() {
    this.personForm.reset();
  }

}
