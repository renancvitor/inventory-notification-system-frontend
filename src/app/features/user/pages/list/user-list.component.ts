import { Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { RouterModule } from '@angular/router';

import { UserService } from '../../services/user.service';
import { UserListItem, UserListResponse, UserType } from '../../services/user.model';
import { SearchFieldComponent } from '../../../../shared/components/search-field/search-field.component';
import { FilterPanelComponent } from '../../../../shared/components/filter-panel/filter-panel.component';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-user-list.component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatPaginatorModule, MatButtonModule, SearchFieldComponent, MatMenuModule, 
    FilterPanelComponent, MatRadioModule, MatRadioGroup, FormsModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {

  dataSource: MatTableDataSource<UserListItem> = new MatTableDataSource<UserListItem>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  get displayedColumns(): string[] {
    return this.canAccessUsers
      ? ['name', 'email', 'userType', 'active', 'actions']
      : ['name', 'email', 'userType', 'active'];
  }

  get canAccessUsers() {
    return this.authService.canAccessUsers();
  }

  userTypes: UserType[] = [];

  ngOnInit() {
    this.userService.getUserTypes().subscribe((types) => {
      this.userTypes = types;
    });

    this.loadUsers();
  }
  
  ngAfterViewInit() {
    this.paginator.page.subscribe(() => {
      this.loadUsers();
    });
  }

  totalUsers = 0;

  filters = {
    status: 'all',
    userType: 'all'
  };

  get activeFilterCount() {
    return [this.filters.status, this.filters.userType]
      .filter((value) => value !== 'all')
      .length;
  }

  applyFilters() {
    this.paginator.pageIndex = 0;
    this.loadUsers();
  }

  clearFilters() {
    this.filters = {
      status: 'all',
      userType: 'all'
    };

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

    const userType =
      this.filters.userType === 'all'
        ? undefined
        : this.filters.userType;

    this.userService.list({
      active,
      userType,
      search: this.searchTerm || undefined,
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10
    })
    .subscribe((response: UserListResponse) => {
      this.dataSource.data = response.content;
      this.totalUsers = response.totalElements;
      
      this.changeDetectorRef.markForCheck();
    });

  }

}
