import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
})
export class SearchFieldComponent {

  searchTerm = '';
 
  private timeout?: ReturnType<typeof setTimeout>;

  @Input() label = 'Pesquisar';
  @Input() placeholder = 'Buscar...';

  @Output() search = new EventEmitter<string>();

  onInput() {

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.search.emit(this.searchTerm);
    }, 400);
  }

}
