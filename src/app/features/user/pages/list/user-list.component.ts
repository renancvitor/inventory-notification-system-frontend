import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-list.component',
  imports: [CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {

  displayedColumns: string[] = ['name', 'email', 'userType', 'active', 'actions'];

  dataSource: any[] = [];

}
