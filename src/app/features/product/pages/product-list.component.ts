import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

}
