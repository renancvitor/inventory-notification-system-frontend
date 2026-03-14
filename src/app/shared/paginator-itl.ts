import { MatPaginatorIntl } from '@angular/material/paginator';

export function getPortuguesePaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Itens por página';
  paginatorIntl.nextPageLabel = 'Próxima página';
  paginatorIntl.previousPageLabel = 'Página anterior';

  paginatorIntl.getRangeLabel = (page, pageSize, length) => {
    if (length === 0) return `0 de ${length}`;
    const start = page * pageSize;
    const end = start + pageSize;
    return `${start + 1} – ${Math.min(end, length)} de ${length}`;
  };

  return paginatorIntl;
}