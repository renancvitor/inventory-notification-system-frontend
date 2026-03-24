import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list.component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {

  displayedColumns: string[] = ['name', 'brand', 'category', 'price', 'validity', 'stock', 'active', 'actions'];

  dataSource: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService) {}

  ngAfterViewInit() {
    this.loadProducts();

    this.paginator.page.subscribe(() => {
      this.loadProducts();
    });
  }

  loadProducts() {

    this.productService.list({
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10,
    })
    .subscribe((response: any) => {
      this.dataSource = response.content;
    })
  }

}
