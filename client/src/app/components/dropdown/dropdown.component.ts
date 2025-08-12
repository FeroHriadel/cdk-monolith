import { Component, Input } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DropdownProps } from '../../models/dropdown.model';


@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  template: `
    <div ngbDropdown class="d-inline-block">
      <button class="btn btn-outline-primary border-0" ngbDropdownToggle>
        {{ props!.buttonLabel }}
      </button>
      <div ngbDropdownMenu>
        <button
          *ngFor="let item of props.items"
          ngbDropdownItem
          (click)="onItemClick(item.itemValue)"
        >
          {{ item.itemLabel }}
        </button>
      </div>
    </div>
  `
})



export class DropdownComponent {
  @Input() props!: DropdownProps;

  onItemClick(itemValue: any) {
    this.props.onClick(itemValue);
  }
  
}
