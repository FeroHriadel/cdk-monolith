import { Component, effect, inject, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { ListItem } from '../../models/list.model';
import { ListComponent } from '../../components/list/list.component';



@Component({
  selector: 'app-items',
  imports: [ListComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})



export class ItemsPageComponent implements OnInit {
  //items
  private itemsService: ItemService = inject(ItemService);
  public items: Item[] = [];
  public itemsList: ListItem[] = [];


  // on mount
  ngOnInit(): void {
    this.itemsService.getItems();
  }


  // effects
  private itemsEffect = effect(() => this.populateItems());


  // populate items & itemList for <app-list>
  private populateItems(): void {
    this.items = this.itemsService.items();
    this.itemsList = this.itemsService.mapItemsToListItems(this.items);
  }

}
