import { Component, effect, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { ListItem } from '../../models/list.model';
import { ListComponent } from '../../components/list/list.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormService } from '../../services/form.service';
import { CategoryService } from '../../services/category.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '../../components/form/form.component';
import { NgIf } from '@angular/common';



enum ItemAction {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}




@Component({
  selector: 'app-items',
  imports: [ListComponent, ModalComponent, FormComponent, NgIf],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})



export class ItemsPageComponent implements OnInit {
  //items
  private itemsService: ItemService = inject(ItemService);
  public items: Item[] = [];
  public itemsList: ListItem[] = [];
  public ItemAction = ItemAction;
  public itemAction: ItemAction | null = null;
  public editedItem: Item | null = null;
  
  //categories
  private categoryService: CategoryService = inject(CategoryService);
  public categoriesForSelect: { label: string; value: string }[] = [];

  // modal
  @ViewChild('modalRef') modal!: ModalComponent;
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  // forms
  public formService: FormService = inject(FormService);
  public addItemForm: FormGroup = new FormGroup({});
  public addItemFields = [
    {
      name: 'Name',
      label: 'Name',
      type: 'text' as 'text',
      placeholder: 'Item name',
      validators: [Validators.required, Validators.minLength(2)]
    },
    {
      name: 'Description',
      label: 'Description',
      type: 'text' as 'text',
      placeholder: 'Item description',
      validators: []
    },
    {
      name: 'CategoryId',
      label: 'Category',
      type: 'select' as 'select',
      options: this.categoriesForSelect
    }
  ]


  // on mount
  ngOnInit(): void {
    this.itemsService.getItems();
    this.categoryService.getCategories();
    this.initForms();
  }


  // effects (runs everytime cb dependencies change)
  private itemsEffect = effect(() => this.populateItems());
  private categoriesEffect = effect(() => this.populateCategoriesForSelect());


  // populate items & itemList for <app-list>
  private populateItems(): void {
    this.items = this.itemsService.items();
    this.itemsList = this.itemsService.mapItemsToListItems(this.items);
  }

  private populateCategoriesForSelect(): void {
    //map categories to select options
    this.categoriesForSelect = this.categoryService.categories().map(category => ({
      label: category.name,
      value: category.id.toString()
    }));
    //update select field options
    this.addItemFields[2].options = this.categoriesForSelect;
  }


  // initialize edit & add forms
  private initForms(): void {
    this.addItemForm = this.addItemForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      Description: new FormControl('', []),
      CategoryId: new FormControl('', [Validators.required])
    });
  }

  // user click on add icon in <app-list>
  public onItemAdd(): void {
    this.itemAction = ItemAction.ADD;
    this.modal.open(this.modalContent);
  }

  // user click on edit icon in <app-list>
  public onItemEdit(item: ListItem): void {}


  // user click on delete icon in <app-list>
  public onItemDelete(item: ListItem): void {
    this.itemAction = ItemAction.DELETE;
    this.editedItem = item.value;
    this.modal.open(this.modalContent);
  }

  // clear itemAction and editedItem
  private clearEditMode() {
    this.itemAction = null;
    this.editedItem = null;
  }

  // check - can form be submitted?
  private canSubmit(form: FormGroup): boolean {
    if (form.disabled) return false;
    if (!this.formService.isFormValid(form)) {
      this.formService.showError(form);
      return false;
    }
    return true;
  }

  // toggle form loading state
  private toggleLoading(form: FormGroup) {
    form.disabled ? form.enable() : form.disable();
  }

  // user submits add item form
  public onAddItemSubmit(): void {
    if (!this.canSubmit(this.addItemForm)) return;
    this.toggleLoading(this.addItemForm);
    this.itemsService.createItem({...this.addItemForm.value, CategoryId: this.addItemForm.value.CategoryId})
      .subscribe({
        next: response => {
          this.itemsService.setItems([...this.items, response.data]);
          this.toggleLoading(this.addItemForm);
          this.addItemForm.reset();
          this.clearEditMode();
          this.modal.close();
        },
        error: err => {
          this.toggleLoading(this.addItemForm);
          this.formService.showError(err?.error?.message || 'Failed to create item');
        },
      });
  }

  // user confirms deletion
  public onDeleteItemSubmit(): void {
    if (!this.editedItem) return;
    this.itemsService.deleteItem(this.editedItem.id)
      .subscribe({
        next: () => {
          this.itemsService.setItems(this.items.filter(i => i.id !== this.editedItem!.id));
          this.clearEditMode();
          this.modal.close();
        },
        error: err => {
          this.formService.showError(err?.error?.message || 'Failed to delete item');
        },
      });
  }

}
