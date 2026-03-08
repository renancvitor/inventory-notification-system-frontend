import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class ButtonComponent {

  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

}
