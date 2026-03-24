import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { ProductService } from '../services/product.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SearchFieldComponent } from '../../../shared/components/search-field/search-field.component';
import { FilterPanelComponent } from '../../../shared/components/filter-panel/filter-panel.component';

@Component({
  selector: 'app-product-list.component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatMenuModule, ButtonComponent, SearchFieldComponent, FilterPanelComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {

  displayedColumns: string[] = ['name', 'brand', 'category', 'price', 'validity', 'stock', 'active', 'actions'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService) {}

  ngAfterViewInit() {
    this.loadProducts();

    this.paginator.page.subscribe(() => {
      this.loadProducts();
    });
  }

  totalProducts = 0;

  loadProducts() {

    this.productService.list({
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10,
    })
    .subscribe((response: any) => {
      this.dataSource.data = response.content;
      this.totalProducts = response.totalElements;
    })
  }

  onSearch(value: string) {
    //
  }

}
