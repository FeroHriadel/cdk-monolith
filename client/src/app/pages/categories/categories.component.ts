import { Component, inject, OnInit, effect, ViewChild, TemplateRef } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ListComponent } from '../../components/list/list.component';
import { Category } from '../../models/category.model';
import { ListItem } from '../../models/list.model';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormComponent } from '../../components/form/form.component';
import { FormService } from '../../services/form.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FormField } from '../../models/form.model';
import { CategoryCreateResponse } from '../../models/category.model';
import { ImageService } from '../../services/image.service';



enum CategoryAction {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}



@Component({
  selector: 'app-categories',
  imports: [ListComponent, ModalComponent, FormComponent, ReactiveFormsModule, NgIf],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})




export class CategoriesPageComponent implements OnInit {
  // modal
  @ViewChild('modalRef') modal!: ModalComponent;
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  
  // categories
  public categoryService = inject(CategoryService);
  public categories: Category[] = [];
  public categoriesList: ListItem[] = []; //mapped categories for <app-list> component
  public CategoryAction = CategoryAction;
  public categoryAction: CategoryAction | null = null;
  public editedCategory: Category | null = null; // what category is being edited or deleted

  // image
  public imageService = inject(ImageService);
  private acceptedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  public selectedImage: File | null = null;

  // forms
  public formService = inject(FormService);
  public addCategoryForm: FormGroup = new FormGroup({});
  public editCategoryForm: FormGroup = new FormGroup({});
  public addCategoryFields: FormField[] = [
    {
      name: 'Name', 
      label: 'Name', 
      type: 'text' as 'text', 
      placeholder: 'Category name', 
      validators: [Validators.required, Validators.minLength(2)],
    },
    {
      name: 'Description',
      label: 'Description',
      type: 'text' as 'text',
      placeholder: 'Category description',
    },
    {
      name: 'File',
      label: 'Picture',
      type: 'file' as 'file',
      onFileSelected: (event: Event) => this.onFileSelected(event), 
      }
    ];
  public editCategoryFields: FormField[] = [
    {
      name: 'Name',
      label: 'Name',
      type: 'text' as 'text',
      placeholder: 'Category name',
      validators: [Validators.required, Validators.minLength(2)],
    },
    {
      name: 'Description',
      label: 'Description',
      type: 'text' as 'text',
      placeholder: 'Category description',
    },
    {
      name: 'File',
      label: 'Add new picture',
      type: 'file' as 'file',
      onFileSelected: (event: Event) => this.onFileSelected(event),
    }
  ];

  
  // lifecycle
  ngOnInit(): void {
    this.categoryService.getCategories();
    this.initForms();
  }


  // effects
  private categoriesEffect = effect(() => this.populateCategories());


  // populate categories & map them to categoriesList for <app-list> component
  private populateCategories() {
    this.categories = this.categoryService.categories();
    this.categoriesList = this.categories.map(category => ({
      label: category.name,
      value: category
    }));
  }

  // user clicks add icon in <app-list>
  public onItemAdd() {
    this.categoryAction = CategoryAction.ADD;
    this.editedCategory = null;
    this.modal.open(this.modalContent);
  }

  // user clicks edit icon in <app-list>
  public onItemEdit(item: ListItem) {
    this.categoryAction = CategoryAction.EDIT;
    this.editedCategory = item.value;
    this.editCategoryForm.patchValue({ Name: item.value.name, Description: item.value.description });
    this.modal.open(this.modalContent);
  }

  // user clicks delete icon in <app-list>
  public onItemDelete(item: ListItem) {
    this.categoryAction = CategoryAction.DELETE;
    this.editedCategory = item.value;
    this.modal.open(this.modalContent);
  }

  // user confirmed the modal
  public onModalConfirm() {
    console.log('Modal confirmed');
  }

  // user closed the modal
  public onModalClose() {
    console.log('Modal closed');
  }

  // clear categoryAction and editedCategory
  private clearEditMode() {
    this.categoryAction = null;
    this.editedCategory = null;
  }

  // init addCategoryForm & editCategoryForm
  private initForms() {
    this.addCategoryForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      Description: new FormControl('', []),
      File: new FormControl(null, [])
    });
    this.editCategoryForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      Description: new FormControl('', []),
      File: new FormControl(null, [])
    });
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

  // user submits add new category
  public onAddCategorySubmit() {
    if (!this.canSubmit(this.addCategoryForm)) return;
    this.toggleLoading(this.addCategoryForm);
    this.categoryService.createCategory(this.addCategoryForm.value)
      .subscribe({
        next: (res: CategoryCreateResponse) => {
          this.categoryService.setCategories([...this.categories, res.data]);
          this.toggleLoading(this.addCategoryForm);
          this.addCategoryForm.reset();
          this.clearEditMode();
          this.modal.close();
        },
        error: (error) => {
          this.toggleLoading(this.addCategoryForm);
          this.formService.showError(error?.error?.message || 'Failed to add category');
        }
      });
  }

  // user submits edit category
  public onEditCategorySubmit() {
    if (!this.canSubmit(this.editCategoryForm)) return;
    this.toggleLoading(this.editCategoryForm);
    this.categoryService.updateCategory({ id: this.editedCategory!.id, ...this.editCategoryForm.value })
      .subscribe({
        next: (res: CategoryCreateResponse) => {
          this.categoryService.setCategories(this.categories.map(category => category.id === res.data.id ? res.data : category));
          this.toggleLoading(this.editCategoryForm);
          this.editCategoryForm.reset();
          this.clearEditMode();
          this.modal.close();
        },
        error: (error) => {
          this.toggleLoading(this.editCategoryForm);
          this.formService.showError(error?.message || 'Failed to edit category');
        }
      });
  }

  // user confirms delete category
  public onDeleteCategorySubmit() {
    if (!this.editedCategory) return;
    this.categoryService.deleteCategory(this.editedCategory.id)
      .subscribe({
        next: () => {
          this.categoryService.setCategories(this.categories.filter(category => category.id !== this.editedCategory!.id));
          this.clearEditMode();
          this.modal.close();
        },
        error: (error) => {
          console.log(error)
          this.formService.showError(error?.error?.message || 'Failed to delete category');
        }
      });
  }

  // put file which user selected in input to form control
  public onFileSelected(event: Event) {
    const images = this.imageService.getInputImages({event, numberOfFiles: 1, accept: this.acceptedImageTypes});
    // if user uploaded image
    if (images?.length) {
      this.selectedImage = images[0];
      this.addCategoryForm.patchValue({ File: this.selectedImage });
    }
    // if user uploaded a file which is not an image
    else {
      this.formService.showError('Selected file is not an image and will not be uploaded');
      this.selectedImage = null;
      this.addCategoryForm.patchValue({ File: null });
    }
  }

}
