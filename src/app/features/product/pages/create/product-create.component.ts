import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductCategory, ProductService } from '../../services/product.service';
import { ProductFormComponent, ProductFormValue } from '../../components/form/product-form.component';

@Component({
  selector: 'app-product-create.component',
  standalone: true,
  imports: [ProductFormComponent],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent {

  constructor(private productService: ProductService, private router: Router, private snackBar: MatSnackBar) {}

  @ViewChild(ProductFormComponent) productFormComponent!: ProductFormComponent;

  loading = false;
  loadingCategories = false;
  categories: ProductCategory[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  createProduct(productData: ProductFormValue) {

    this.loading = true;

    const payload = {
      ...productData,
      categoryId: Number(productData.categoryId),
      price: Number(productData.price),
      stock: Number(productData.stock),
      minimumStock: Number(productData.minimumStock),
    };

    this.productService.create(payload).subscribe({
      next: (product) => {
        this.loading = false;
        this.productFormComponent.resetForm();
        this.showSuccessToast(product);
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/products']);
  }

  showSuccessToast(product: any) {

    const snackBarRef = this.snackBar.open(`Produto "${product.productName}" criado com sucesso!`,
      'Ver Produto', 
      { duration: 5000 }
    );

    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/products']);
    });
  }

  private loadCategories() {
    this.loadingCategories = true;

    this.productService.listCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: () => {
        this.loadingCategories = false;
      }
    });
  }

}
