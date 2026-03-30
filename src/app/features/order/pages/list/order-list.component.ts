import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';

import { OrderService, OrderSummary } from '../../services/order.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SearchFieldComponent } from '../../../../shared/components/search-field/search-field.component';
import { FilterPanelComponent } from '../../../../shared/components/filter-panel/filter-panel.component';

@Component({
  selector: 'app-order-list.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatRadioModule,
    RouterModule,
    ButtonComponent,
    SearchFieldComponent,
    FilterPanelComponent,
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements AfterViewInit {

  private readonly brlFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  private readonly dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  displayedColumns: string[] = ['id', 'createdAt', 'orderType', 'totalValue', 'status', 'analyzedBy', 'actions'];

  dataSource = new MatTableDataSource<OrderSummary>([]);

  totalOrders = 0;
  searchTerm = '';

  filter = {
    status: 'all',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderService: OrderService) {}

  ngAfterViewInit() {
    this.loadOrders();

    this.paginator.page.subscribe(() => {
      this.loadOrders();
    });
  }

  get activeFilterCount() {
    return [this.filter.status].filter((value) => value !== 'all').length;
  }

  loadOrders() {
    if (this.filter.status !== 'all') {
      this.orderService.listAll({
        search: this.searchTerm || undefined,
      })
      .subscribe((orders) => {
        const filteredOrders = orders
          .map((order) => this.normalizeOrder(order))
          .filter((order) => this.matchesStatusFilter(order));

        this.totalOrders = filteredOrders.length;
        this.dataSource.data = this.paginateOrders(filteredOrders);
      });

      return;
    }

    this.orderService.list({
      search: this.searchTerm || undefined,
      page: this.paginator?.pageIndex ?? 0,
      size: this.paginator?.pageSize ?? 10,
    })
    .subscribe((response) => {
      this.dataSource.data = (response.content ?? []).map((order) => this.normalizeOrder(order));
      this.totalOrders = response.totalElements ?? 0;
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.paginator.pageIndex = 0;
    this.loadOrders();
  }

  applyFilter() {
    this.paginator.pageIndex = 0;
    this.loadOrders();
  }

  clearFilter() {
    this.filter = {
      status: 'all',
    };

    this.paginator.pageIndex = 0;
    this.loadOrders();
  }

  formatOrderId(value: number | string | null | undefined) {
    const numericValue = Number(value);

    if (value === null || value === undefined || Number.isNaN(numericValue)) {
      return '-';
    }

    return new Intl.NumberFormat('pt-BR').format(numericValue);
  }

  formatDate(value: string | Date | null | undefined) {
    if (!value) {
      return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return this.dateFormatter.format(date);
  }

  formatCurrency(value: number | string | null | undefined) {
    const numericValue = Number(value);

    if (value === null || value === undefined || Number.isNaN(numericValue)) {
      return '-';
    }

    return this.brlFormatter.format(numericValue);
  }

  getAnalyzedBy(order: OrderSummary) {
    return order.approvedByName || order.rejectedByName || order.approvedBy || order.rejectedBy || '-';
  }

  getStatusClass(status: string | undefined) {
    switch ((status || '').toLowerCase()) {
      case 'aprovado':
        return 'order-list__status--approved';
      case 'pendente':
        return 'order-list__status--pending';
      case 'reprovado':
      case 'rejeitado':
        return 'order-list__status--rejected';
      default:
        return '';
    }
  }

  private normalizeOrder(order: OrderSummary): OrderSummary {
    return {
      ...order,
      status: order.status || '-',
      orderType: order.orderType || this.inferOrderType(order),
    };
  }

  private inferOrderType(order: OrderSummary) {
    return order.movements?.[0]?.movementType || '-';
  }

  private matchesStatusFilter(order: OrderSummary) {
    const normalizedStatus = (order.status || '').trim().toLowerCase();

    switch (this.filter.status) {
      case 'pending':
        return normalizedStatus === 'pendente';
      case 'approved':
        return normalizedStatus === 'aprovado';
      case 'rejected':
        return normalizedStatus === 'reprovado' || normalizedStatus === 'rejeitado';
      default:
        return true;
    }
  }

  private paginateOrders(orders: OrderSummary[]) {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;
    const start = pageIndex * pageSize;

    return orders.slice(start, start + pageSize);
  }

}
