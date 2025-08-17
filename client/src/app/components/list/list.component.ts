import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ListItem } from '../../models/list.model';
import { NgIconsModule } from '@ng-icons/core';
import { bootstrapPencil, bootstrapPlus, bootstrapTrash } from '@ng-icons/bootstrap-icons';



@Component({
  selector: 'app-list',
  imports: [NgIconsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  host: {}
})



export class ListComponent{
  public icons = { bootstrapPencil, bootstrapPlus, bootstrapTrash };

  /** @required */
  @Input() items: ListItem[] = [];

  /** @required */
  @Input() title: string = '';

  @Output() onItemEdit = new EventEmitter<ListItem>();

  @Output() onItemDelete = new EventEmitter<ListItem>();

  @Output() onItemAdd = new EventEmitter<ListItem>();
}
