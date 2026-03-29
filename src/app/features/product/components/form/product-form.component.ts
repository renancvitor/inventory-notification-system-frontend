import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ProductCategory } from '../../services/product.service';

export interface ProductFormValue {
  productName: string;
  categoryId: number;
  price: number;
  validity: string;
  description: string;
  stock: number;
  minimumStock: number;
  brand: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {

  @Output() submitForm = new EventEmitter<ProductFormValue>();
  @Output() cancel = new EventEmitter<void>();
  @Input() loading = false;
  @Input() categories: ProductCategory[] = [];
  @Input() title = '';
  @Input() showSummary = false;
  @Input() statusLabel: string | null = null;
  @Input() showStockSummary = false;
  @Input() showStockField = true;
  @Input() showMinimumStockField = false;
  @Input() submitLabel = 'Salvar Alterações';

  private _loadingCategories = false;

  private formBuilder = inject(FormBuilder);

  readonly minValidityDate = this.getTomorrowDate();

  productForm = this.formBuilder.group({
    productName: ['', Validators.required],
    categoryId: [null as number | null, Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    validity: [''],
    description: [''],
    stock: [0, [Validators.required, Validators.min(0)]],
    minimumStock: [null as number | null, [Validators.min(0)]],
    brand: ['', Validators.required],
  });

  @Input()
  set loadingCategories(value: boolean) {
    this._loadingCategories = value;

    const categoryControl = this.productForm.controls.categoryId;

    if (value) {
      categoryControl.disable({ emitEvent: false });
      return;
    }

    categoryControl.enable({ emitEvent: false });
  }

  get loadingCategories() {
    return this._loadingCategories;
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formValue = this.productForm.getRawValue();

    this.submitForm.emit({
      productName: formValue.productName ?? '',
      categoryId: Number(formValue.categoryId),
      price: Number(formValue.price ?? 0),
      validity: formValue.validity ?? '',
      description: formValue.description ?? '',
      stock: Number(formValue.stock ?? 0),
      minimumStock: Number(formValue.minimumStock ?? 0),
      brand: formValue.brand ?? '',
    });
  }

  resetForm() {
    this.productForm.reset({
      productName: '',
      categoryId: null,
      price: null,
      validity: '',
      description: '',
      stock: 0,
      minimumStock: null,
      brand: '',
    });
  }

  private getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.toISOString().split('T')[0];
  }

}
