import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioGroup } from '@angular/material/radio';
import { MatRadioModule } from '@angular/material/radio';

import { PersonService } from '../../services/person.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FilterPanelComponent } from '../../../../shared/components/filter-panel/filter-panel.component';
import { SearchFieldComponent } from '../../../../shared/components/search-field/search-field.component'; 

@Component({
  selector: 'app-person.component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, ButtonComponent, MatMenuModule, FormsModule, SearchFieldComponent,
    FilterPanelComponent, MatRadioGroup, MatRadioModule, RouterModule],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
})
export class PersonComponent {

  displayedColumns: string[] = ['personName', 'cpf', 'email', 'active', 'actions'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private personService: PersonService) {}

  ngAfterViewInit() {
    this.loadPersons();

    this.paginator.page.subscribe(() => {
      this.loadPersons();
    });
  }

  totalPerson = 0;

  filters = {
    status: 'all'
  };

  applyFilters() {
    this.paginator.pageIndex = 0;
    this.loadPersons();
  }

  clearFilters() {
    this.filters.status = 'all';
    this.paginator.pageIndex = 0;
    this.loadPersons();
  }

  searchTerm = '';
  
  onSearch(term: string) {
    this.searchTerm = term;
    this.paginator.pageIndex = 0;
    this.loadPersons();
  }

  loadPersons() {

    const active =
      this.filters.status === 'all'
        ? undefined
        : this.filters.status === 'active';

    this.personService.list({
      active,
      search: this.searchTerm || undefined,
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10
    })
    .subscribe((response: any) => {
      this.dataSource.data = response.content;
      this.totalPerson = response.totalElements;
    });

  }

}
