import { Component, Input } from '@angular/core';
import { MultiselectProps } from '../../models/multiselect.model';



@Component({
  selector: 'app-multiselect',
  imports: [],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.css'
})



export class MultiselectComponent {
  @Input() props!: MultiselectProps;
  public isOpen: boolean = false;
  

  public onItemClick(item: any): void {
    if (!this.props.onItemClick) throw new Error('onItemClick is not defined (multiselect.component)');
    this.props.onItemClick(item);
  }

  public isSelected(item: any): boolean {
    return this.props.selectedItems.map(si => si.id).includes(item.id);
  }

  public toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

}
