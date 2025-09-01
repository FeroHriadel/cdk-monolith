import { Component, effect, inject, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';
import { ListItem } from '../../models/list.model';
import { ListComponent } from '../../components/list/list.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormService } from '../../services/form.service';
import { CategoryService } from '../../services/category.service';
import { TagService } from '../../services/tag.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '../../components/form/form.component';
import { NgIf } from '@angular/common';
import { Tag } from '../../models/tag.model';
import { Subscription } from 'rxjs';
import { ImageService } from '../../services/image.service';



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



export class ItemsPageComponent implements OnInit, OnDestroy {
  //items
  private itemsService: ItemService = inject(ItemService);
  public items: Item[] = [];
  public itemsList: ListItem[] = [];
  public ItemAction = ItemAction;
  public itemAction: ItemAction | null = null;
  public editedItem: Item | null = null;

  // image
  public imageService = inject(ImageService);
  private acceptedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  public selectedImage: File | null = null;

  //categories
  private categoryService: CategoryService = inject(CategoryService);
  public categoriesForSelect: { label: string; value: string }[] = [];

  //tags
  private tagService: TagService = inject(TagService);
  private tagsSubscription: Subscription | undefined;
  private selectedTags: Tag[] = [];

  // modal
  @ViewChild('modalRef') modal!: ModalComponent;
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  // forms
  public formService: FormService = inject(FormService);
  public addItemForm: FormGroup = new FormGroup({});
  public editItemForm: FormGroup = new FormGroup({});
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
    },
    {
      name: 'Tags',
      label: 'Tags',
      type: 'multiselect' as 'multiselect',
      selectedItems: this.selectedTags,
      options: [] as { label: string; value: Tag }[], //will be populated from tagService
      title: 'Select tags',
      onItemClick: (item: Tag) => this.onTagSelect(item)
    },
    {
      name: 'Images',
      label: 'Image',
      type: 'file' as 'file',
      onFileSelected: (event: Event) => this.onFileSelected(event)
    }
  ];
  public editItemFields = [...this.addItemFields];


  // effects (run everytime cb dependencies change)
  private itemsEffect = effect(() => this.populateItems());
  private categoriesEffect = effect(() => this.populateCategoriesForSelect());
  private tagsEffect = effect(() => this.populateTags());


  // lifecycle
  ngOnInit(): void {
    this.itemsService.getItems();
    this.categoryService.getCategories();
    this.tagService.fetchTags();
    this.initForms();
  }

  ngOnDestroy(): void {
    this.itemsEffect.destroy();
    this.categoriesEffect.destroy();
    this.tagsEffect.destroy();
    this.tagsSubscription?.unsubscribe();
  }


  // populate items & itemList for <app-list>
  private populateItems(): void {
    this.items = this.itemsService.items();
    this.itemsList = this.itemsService.mapItemsToListItems(this.items);
  }

  // populate categories for select
  private populateCategoriesForSelect(): void {
    //map categories to select options
    this.categoriesForSelect = this.categoryService.categories().map(category => ({
      label: category.name,
      value: category.id.toString()
    }));
    //update select field options
    this.addItemFields[2].options = this.categoriesForSelect;
  }

  // populate tags for multiselect
  public populateTags() {
    this.tagsSubscription = this.tagService.tags$.subscribe(tags => {
      this.addItemFields[3].options = tags.map(tag => ({
        label: tag.name,
        value: tag
      }));
    });
  }

  // user selected a tag
  public onTagSelect(tag: Tag) {
    if (this.selectedTags.find(t => t.id === tag.id)) {
      this.selectedTags = [...this.selectedTags.filter(t => t.id !== tag.id)];
    } else {
      this.selectedTags = [...this.selectedTags, tag];
    }
    this.addItemFields[3].selectedItems = this.selectedTags; //if you assign a new array reference, Angular will detect the change and update it for the child
  }

  // put file which user selected in input to form control
  public onFileSelected(event: Event) {
    const images = this.imageService.getInputImages({event, numberOfFiles: 1, accept: this.acceptedImageTypes});
    // if user uploaded image
    if (images?.length) {
      this.selectedImage = images[0];
    }
    // if user uploaded a file which is not an image
    else {
      this.formService.showError('Selected file is not an image and will not be uploaded');
      this.selectedImage = null;
    }
  }

  // initialize edit & add forms
  private initForms(): void {
    this.addItemForm = this.addItemForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      Description: new FormControl('', []),
      CategoryId: new FormControl('', [Validators.required]),
      Images: new FormControl(null, [])
    });
    this.editItemForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      Description: new FormControl('', []),
      CategoryId: new FormControl('', [Validators.required]),
      Images: new FormControl(null, [])
    });
  }

  // user click on add icon in <app-list>
  public onItemAdd(): void {
    this.itemAction = ItemAction.ADD;
    this.modal.open(this.modalContent);
  }

  // user click on edit icon in <app-list>
  public onItemEdit(item: ListItem): void {
    console.log('Editing item:', item);
    this.itemAction = ItemAction.EDIT;
    this.editedItem = item.value;
    this.editItemForm.patchValue({
      Name: item.value.name,
      Description: item.value.description,
      CategoryId: item.value.categoryId,
    });
    this.selectedTags = item.value.tags || [];
    this.editItemFields[3].selectedItems = this.selectedTags;
    this.modal.open(this.modalContent);
  }

  // user click on delete icon in <app-list>
  public onItemDelete(item: ListItem): void {
    this.itemAction = ItemAction.DELETE;
    this.editedItem = item.value;
    this.modal.open(this.modalContent);
  }

  // clear itemAction and editedItem
  public clearEditMode() {
    this.itemAction = null;
    this.editedItem = null;
    this.selectedTags = [];
    this.addItemForm.reset();
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
    this.itemsService.createItem({
      ...this.addItemForm.value, 
      CategoryId: this.addItemForm.value.CategoryId,
      TagIds: this.selectedTags.map(t => t.id),
      Images: this.selectedImage
    })
      .subscribe({
        next: response => {
          this.itemsService.setItems([...this.items, response.data]);
          this.toggleLoading(this.addItemForm);
          this.selectedImage = null;
          this.clearEditMode();
          this.modal.close();
        },
        error: err => {
          this.toggleLoading(this.addItemForm);
          this.formService.showError(err?.error?.message || 'Failed to create item');
        },
      });
  }

  // user submits edit item form
  public onEditItemSubmit(): void {
    console.log(this.editItemForm.value, this.selectedTags, this.selectedImage);
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
