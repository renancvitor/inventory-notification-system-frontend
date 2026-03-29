import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProductCategory, ProductDetail, ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../../components/form/product-form.component';
import { ProductFormValue } from '../../services/product-form.model';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly productService = inject(ProductService);

  private productFormComponent?: ProductFormComponent;

  @ViewChild(ProductFormComponent)
  set productForm(component: ProductFormComponent | undefined) {
    this.productFormComponent = component;
    this.patchForm(this.productData);
  }

  id!: number;
  loading = false;
  loadingCategories = false;
  categories: ProductCategory[] = [];
  currentStock = 0;
  productData: ProductDetail | null = null;

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.categories = this.route.snapshot.data['categories'] ?? [];
    this.productData = this.route.snapshot.data['product'] ?? null;

    if (this.productData) {
      this.currentStock = Number(this.productData.stock ?? 0);
    }

    if (!this.categories.length) {
      this.loadCategories();
    }

    if (this.productData) {
      this.patchForm(this.productData);
    }
  }

  saveProduct(productData: ProductFormValue) {
    if (this.loading) {
      return;
    }

    this.loading = true;

    const payload = {
      productName: productData.productName,
      categoryId: Number(productData.categoryId),
      price: Number(productData.price),
      validity: productData.validity || null,
      description: productData.description || null,
      minimumStock: Number(productData.minimumStock ?? 0),
      brand: productData.brand,
    };

    this.productService.update(this.id, payload).subscribe({
      next: (product: ProductDetail) => {
        this.loading = false;
        this.currentStock = Number(product.stock ?? this.currentStock);
        this.productData = product;
        this.patchForm(product);
        this.showSuccessToast(product);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/products']);
  }

  private loadCategories() {
    this.loadingCategories = true;

    this.productService.listCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
        this.patchForm(this.productData);
      },
      error: () => {
        this.loadingCategories = false;
      }
    });
  }

  private resolveCategoryId(category: string | number | null | undefined) {
    if (typeof category === 'number') {
      return category;
    }

    if (!category) {
      return null;
    }

    const normalizedCategory = category.trim().toLowerCase();
    const match = this.categories.find((item) =>
      item.displayName.trim().toLowerCase() === normalizedCategory ||
      item.name.trim().toLowerCase() === normalizedCategory
    );

    if (!match) {
      return null;
    }

    return match.id;
  }

  private patchForm(product: ProductDetail | null) {
    if (!product || !this.productFormComponent) {
      return;
    }

    const categoryId = this.resolveCategoryId(product.category);

    this.productFormComponent.productForm.patchValue({
      productName: product.productName ?? '',
      categoryId,
      price: Number(product.price ?? 0),
      validity: this.normalizeDate(product.validity),
      description: product.description ?? '',
      stock: Number(product.stock ?? 0),
      minimumStock: Number(product.minimumStock ?? 0),
      brand: product.brand ?? '',
    });
  }

  private normalizeDate(value: string | null | undefined) {
    return value ? String(value).split('T')[0] : '';
  }

  private showSuccessToast(product: ProductDetail) {
    this.snackBar.openFromComponent(ToastComponent, {
      panelClass: 'app-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      data: {
        title: 'Cadastro atualizado com sucesso',
        name: product.productName,
        info: `${product.category} • ${this.formatPrice(product.price)} • Estoque atual: ${product.stock ?? this.currentStock}`,
        primaryAction: {
          label: 'Voltar para Produtos',
          type: 'list'
        },
        secondaryAction: null,
        onAction: (action: string) => {
          if (action === 'list') {
            this.router.navigate(['/products']);
          }
        }
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
