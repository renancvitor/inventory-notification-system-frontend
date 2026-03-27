import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';

import { ProductService } from '../../services/product.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SearchFieldComponent } from '../../../../shared/components/search-field/search-field.component';
import { FilterPanelComponent } from '../../../../shared/components/filter-panel/filter-panel.component';

@Component({
  selector: 'app-product-list.component',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule,
    MatMenuModule, MatRadioModule, ButtonComponent, SearchFieldComponent, FilterPanelComponent, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements AfterViewInit {

  private readonly brlFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  private readonly dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  displayedColumns: string[] = ['name', 'brand', 'category', 'price', 'validity', 'stock', 'active', 'actions'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('minPriceField') minPriceField?: SearchFieldComponent;
  @ViewChild('maxPriceField') maxPriceField?: SearchFieldComponent;
  @ViewChild('minPriceField', { read: ElementRef }) minPriceFieldElement?: ElementRef<HTMLElement>;
  @ViewChild('maxPriceField', { read: ElementRef }) maxPriceFieldElement?: ElementRef<HTMLElement>;

  constructor(private productService: ProductService) {}

  ngAfterViewInit() {
    this.configureNumericInput(this.minPriceFieldElement);
    this.configureNumericInput(this.maxPriceFieldElement);
    this.loadProducts();

    this.paginator.page.subscribe(() => {
      this.loadProducts();
    });
  }

  totalProducts = 0;
  searchTerm = '';

  filter = {
    status: 'all',
    minPrice: 'all',
    maxPrice: 'all',
  }

  applyFilter() {
    this.paginator.pageIndex = 0;
    this.loadProducts();
  }

  clearFilter() {
    this.filter = {
      status: 'all',
      minPrice: 'all',
      maxPrice: 'all',
    };
    if (this.minPriceField) {
      this.minPriceField.searchTerm = '';
    }

    if (this.maxPriceField) {
      this.maxPriceField.searchTerm = '';
    }

    this.paginator.pageIndex = 0;
    this.loadProducts();
  }

  private configureNumericInput(fieldElement?: ElementRef<HTMLElement>) {
    const input = fieldElement?.nativeElement.querySelector('input');

    if (!input) {
      return;
    }

    input.inputMode = 'numeric';
    input.pattern = '[0-9]*';

    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D+/g, '');
    });

    input.addEventListener('keydown', (event) => {
      const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
      ];

      if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
        return;
      }

      if (!/^\d$/.test(event.key)) {
        event.preventDefault();
      }
    });
  }

  loadProducts() {
    const active =
      this.filter.status === 'all'
        ? undefined
        : this.filter.status === 'active';

    const minPrice = Number(this.filter.minPrice);
    const maxPrice = Number(this.filter.maxPrice);

    this.productService.list({
      active,
      search: this.searchTerm || undefined,
      minPrice: this.filter.minPrice === 'all' || Number.isNaN(minPrice) ? undefined : minPrice,
      maxPrice: this.filter.maxPrice === 'all' || Number.isNaN(maxPrice) ? undefined : maxPrice,
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10,
    })
    .subscribe((response: any) => {
      this.dataSource.data = response.content ?? [];
      this.totalProducts = response.totalElements ?? 0;
    });
  }

  onSearch(value: string) {
    this.searchTerm = value.trim();
    this.paginator.pageIndex = 0;
    this.loadProducts();
  }

  onMinPriceSearch(value: string) {
    const parsedValue = value.trim();
    this.filter.minPrice = parsedValue === '' ? 'all' : parsedValue;
    this.applyFilter();
  }

  onMaxPriceSearch(value: string) {
    const parsedValue = value.trim();
    this.filter.maxPrice = parsedValue === '' ? 'all' : parsedValue;
    this.applyFilter();
  }

  formatPrice(value: number | string | null | undefined) {
    const numericValue = Number(value);

    if (value === null || value === undefined || Number.isNaN(numericValue)) {
      return '-';
    }

    return this.brlFormatter.format(numericValue);
  }

  formatValidity(value: string | Date | null | undefined) {
    if (!value) {
      return '-';
    }

    const normalizedValue = typeof value === 'string' ? `${value}T00:00:00` : value;
    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return this.dateFormatter.format(date);
  }

}
