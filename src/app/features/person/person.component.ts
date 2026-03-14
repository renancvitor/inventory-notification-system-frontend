import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';

import { PersonService } from './person.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-person.component',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, ButtonComponent],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
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

  loadPersons() {

    this.personService.list({
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10
    })
    .subscribe((response: any) => {
      this.dataSource.data = response.content;
      this.totalPerson = response.totalElements;
    });

  }

}
