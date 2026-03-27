import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductCategory, ProductService } from '../../services/product.service';
import { ProductFormComponent, ProductFormValue } from '../../components/form/product-form.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-product-create.component',
  standalone: true,
  imports: [ProductFormComponent],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent {

  private readonly route = inject(ActivatedRoute);

  constructor(private productService: ProductService, private router: Router, private snackBar: MatSnackBar) {}

  @ViewChild(ProductFormComponent) productFormComponent!: ProductFormComponent;

  loading = false;
  loadingCategories = false;
  categories: ProductCategory[] = [];

  ngOnInit() {
    this.categories = this.route.snapshot.data['categories'] ?? [];

    if (!this.categories.length) {
      this.loadCategories();
    }
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
    this.snackBar.openFromComponent(ToastComponent, {
      panelClass: 'app-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: {
        title: 'Cadastro realizado com sucesso',
        name: product.productName,
        info: `${product.category} • ${this.formatPrice(product.price)} • Estoque inicial: ${product.stock}`,
        primaryAction: {
          label: 'Cadastrar outro',
          type: 'new'
        },
        secondaryAction: {
          label: 'Voltar para Produtos',
          type: 'list'
        },
        onAction: (action: string) => {
          if (action === 'list') {
            this.router.navigate(['/products']);
          }

          if (action === 'new') {
            this.productFormComponent.resetForm();
          }
        }
      }
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

  private formatPrice(value: number | string) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  }

}
