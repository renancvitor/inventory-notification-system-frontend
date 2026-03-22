import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';

import { UserService } from '../../user.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SearchFieldComponent } from '../../../../shared/components/search-field/search-field.component';
import { FilterPanelComponent } from '../../../../shared/components/filter-panel/filter-panel.component';

@Component({
  selector: 'app-user-list.component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule, ButtonComponent, SearchFieldComponent, MatMenuModule, FilterPanelComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {

  displayedColumns: string[] = ['name', 'email', 'userType', 'active', 'actions'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService) {}
  
  ngAfterViewInit() {
    this.loadUsers();

    this.paginator.page.subscribe(() => {
      this.loadUsers();
    });
  }

  totalUsers = 0;

  loadUsers() {

    this.userService.list({
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10
    })
    .subscribe((response: any) => {
      this.dataSource.data = response.content;
      this.totalUsers = response.totalElements;
    });

  }

  onSearch(value: string) {
    console.log(value);    
  }

}
