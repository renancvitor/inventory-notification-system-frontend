import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatRadioGroup } from '@angular/material/radio';

import { UserService } from '../../services/user.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SearchFieldComponent } from '../../../../shared/components/search-field/search-field.component';
import { FilterPanelComponent } from '../../../../shared/components/filter-panel/filter-panel.component';

@Component({
  selector: 'app-user-list.component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule, ButtonComponent, SearchFieldComponent, MatMenuModule, 
    FilterPanelComponent, MatRadioModule, MatRadioGroup, FormsModule],
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

  filters = {
    status: 'all'
  };

  applyFilters() {
    this.paginator.pageIndex = 0;
    this.loadUsers();
  }

  clearFilters() {
    this.filters.status = 'all';
    this.paginator.pageIndex = 0;
    this.loadUsers();
  }

  searchTerm = '';

  onSearch(term: string) {
    this.searchTerm = term;
    this.paginator.pageIndex = 0;
    this.loadUsers();
  }

  loadUsers() {

    const active =
      this.filters.status === 'all'
        ? undefined
        : this.filters.status === 'active';

    this.userService.list({
      active,
      search: this.searchTerm || undefined,
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10
    })
    .subscribe((response: any) => {
      this.dataSource.data = response.content;
      this.totalUsers = response.totalElements;
    });

  }

}
