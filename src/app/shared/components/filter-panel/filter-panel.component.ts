import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
})
export class FilterPanelComponent {

  @Output() filtersApplied = new EventEmitter<void>();
  @Output() filtersCleared = new EventEmitter<void>();

}
