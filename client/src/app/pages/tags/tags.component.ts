import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common'; //enables *ngIf
import { TagService } from '../../services/tag.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateTagResponse, DeleteTagResponse, Tag, UpdateTagResponse } from '../../models/tag.model';
import { ListComponent } from '../../components/list/list.component';
import { ListItem } from '../../models/list.model';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormComponent } from '../../components/form/form.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';



enum TagAction {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}



@Component({
  selector: 'app-tags',
  imports: [CommonModule, ListComponent, ModalComponent, ReactiveFormsModule, FormComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})



export class TagsPageComponent implements OnInit {
  // modal
  @ViewChild('modalRef') modal!: ModalComponent;
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  // tags
  private tagService: TagService = inject(TagService);
  public tags$!: Observable<Tag[]>; //tags from TagService
  public tagsList$!: Observable<ListItem[]>; //tags mapped to list items
  public TagAction = TagAction;
  public tagAction: TagAction | null = null; //does user want to: create, edit, or delete?
  public editedTag: Tag | null = null; // what tag is being edited or deleted?

  // forms
  public formService: FormService = inject(FormService);
  public addTagForm: FormGroup = new FormGroup({});
  public editTagForm: FormGroup = new FormGroup({});
  public addTagFields = [
    { name: 'Name', 
      label: 'Name', 
      type: 'text' as 'text', 
      placeholder: 'Tag name', 
      validators: [Validators.required, Validators.minLength(2)],
    },
  ];
  public editTagFields = [
    { name: 'Name', 
      label: 'New name', 
      type: 'text' as 'text', 
      placeholder: 'Tag name', 
      validators: [Validators.required, Validators.minLength(2)],
    },
  ];


  // initialize data on mount
  ngOnInit() {
    this.tagService.fetchTags();
    this.initTags();
    this.initForms();
  }


  // init tags and map them to list items for <app-list>
  private initTags() {
    this.tags$ = this.tagService.tags$;
    this.tagsList$ = this.tags$.pipe(map(tags => this.mapTagsToListItems(tags))); // async pipe in html unsubscribes for you
  }

  // init addTagForm
  private initForms() {
    this.addTagForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
    this.editTagForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }

    // check if form can be submitted
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

  // stop tracking if tag is being created, edited, or deleted & clear forms
  private clearEditMode() {
    this.tagAction = null;
    this.editedTag = null;
    this.addTagForm.reset();
    this.editTagForm.reset();
  }

  // user submitted addTagForm
  public onAddTagSubmit() {
    if (!this.canSubmit(this.addTagForm)) return;
    this.toggleLoading(this.addTagForm);
    this.tagService.addTag({ name: this.addTagForm.value.Name })
      .subscribe({
        next: (res: CreateTagResponse) => {
          this.tagService.setTags([...this.tagService.tagsSubject.value, res.data]);
          this.toggleLoading(this.addTagForm);
          this.addTagForm.reset();
          this.clearEditMode();
          this.modal.close();
        },
        error: (error) => {
          this.toggleLoading(this.addTagForm);
          this.formService.showError(error?.message ||'Failed to add tag');
        }
      });
  }

  // user submitted editTagForm
  public onEditTagSubmit() {
    if (!this.canSubmit(this.editTagForm)) return;
    this.toggleLoading(this.editTagForm);
    this.tagService.editTag({ name: this.editTagForm.value.Name, id: this.editedTag!.id })
      .subscribe({
        next: (res: UpdateTagResponse) => {
          this.tagService.setTags(this.tagService.tagsSubject.value.map(tag => tag.id === res.data.id ? res.data : tag));
          this.toggleLoading(this.editTagForm);
          this.editTagForm.reset();
          this.clearEditMode();
          this.modal.close();
        },
        error: (error) => {
          this.toggleLoading(this.editTagForm);
          this.formService.showError(error?.message ||'Failed to edit tag');
        }
    });
  }

  // user okayed delete tag
  public onDeleteTagConfirm() {
    this.tagService.deleteTag(this.editedTag!.id.toString()).subscribe({
      next: (res: DeleteTagResponse) => {
        this.tagService.setTags(this.tagService.tagsSubject.value.filter(tag => tag.id !== this.editedTag!.id));
        this.clearEditMode();
        this.modal.close();
      },
      error: (error) => {
        this.formService.showError(error?.message || 'Failed to delete tag');
      }
    });
  }

  // maps tags to list items that can be passed to <app-list>
  private mapTagsToListItems(tags: Tag[]): ListItem[] {
    return tags.map(tag => ({
      label: tag.name,
      value: tag
    }));
  }

  // open modal and store clicked tag + tagAction(edit/delete/add)
  public handleOpenModal(action: TagAction, tag: Tag | null) {
    this.tagAction = action;
    this.editedTag = tag;
    this.modal.open(this.modalContent);
  }

  // user clicks add icon in <app-list>
  public onItemAdd() {
    this.handleOpenModal(TagAction.ADD, null);
  }

  // user clicks edit icon in <app-list>
  public onItemEdit(item: ListItem) {
    this.editTagForm.patchValue({ Name: item.value.name });
    this.handleOpenModal(TagAction.EDIT, item.value);
  }

  // user clicks delete icon in <app-list>
  public onItemDelete(item: ListItem) {
    this.handleOpenModal(TagAction.DELETE, item.value);
  }

  // user closed modal - clear tagAction and editedTag
  public onModalClose() {
    this.clearEditMode();
  }

  // when user confirmed the modal
  public onModalConfirm() {
    switch (this.tagAction) {
      case TagAction.ADD:
        console.log('Add tag action confirmed');
        break;
      case TagAction.EDIT:
        console.log('Edit tag action confirmed');
        break;
      case TagAction.DELETE:
        console.log('Delete tag action confirmed');
        break;
    }
  }

}
