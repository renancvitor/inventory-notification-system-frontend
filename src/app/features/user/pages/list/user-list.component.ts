import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

import { UserService } from '../../user.service';

@Component({
  selector: 'app-user-list.component',
  imports: [CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {

  displayedColumns: string[] = ['name', 'email', 'userType', 'active', 'actions'];

  dataSource: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService) {}
  
  ngAfterViewInit() {
    this.loadUsers();

    this.paginator.page.subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers() {

    this.userService.list({
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10
    })
    .subscribe((response: any) => {
      this.dataSource = response.content;
    });
    
  }

}
