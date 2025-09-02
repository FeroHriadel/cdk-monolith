import { Component, Host, HostListener, Input, ElementRef} from '@angular/core';
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
  public elementRef: ElementRef;


  // get this element ref
  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }


  // close options on outside click listener
  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  // trigger props.onItemClick passed from parent
  public onItemClick(item: any): void {
    if (!this.props.onItemClick) throw new Error('onItemClick is not defined (multiselect.component)');
    this.props.onItemClick(item);
  }

  // check if item is selected
  public isSelected(item: any): boolean {
    return this.props.selectedItems.map(si => si.id).includes(item.id);
  }

  // toggle options
  public toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

}
