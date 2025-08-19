import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common'; //enables *ngIf
import { TagService } from '../../services/tag.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from '../../models/tag.model';
import { ListComponent } from '../../components/list/list.component';
import { ListItem } from '../../models/list.model';
import { ModalComponent } from '../../components/modal/modal.component';



enum TagAction {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}



@Component({
  selector: 'app-tags',
  imports: [CommonModule, ListComponent, ModalComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})



export class TagsPageComponent implements OnInit {
  @ViewChild('modalRef') modal!: ModalComponent;
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;
  private tagService: TagService = inject(TagService);
  public tags$!: Observable<Tag[]>;
  public tagsList$!: Observable<ListItem[]>;
  public TagAction = TagAction;
  public tagAction: TagAction | null = null;
  public editedTag: Tag | null = null;


  ngOnInit() {
    this.tagService.fetchTags();
    this.tags$ = this.tagService.tags$;
    this.tagsList$ = this.tags$.pipe(map(tags => this.mapTagsToListItems(tags))); 
    // no need to unsubscribe - asyn pipe in html does it
  }


  // maps tags to list items that can be passed to <app-list>
  private mapTagsToListItems(tags: Tag[]): ListItem[] {
    return tags.map(tag => ({
      label: tag.name,
      value: tag
    }));
  }

  // open modal and save clicked tag + tagAction(edit/delete/add)
  public handleOpenModal(action: TagAction, tag: Tag | null) {
    this.tagAction = action;
    this.editedTag = tag;
    this.modal.open(this.modalContent);
  }

  // when user clicks add icon in <app-list>
  public onItemAdd() {
    this.handleOpenModal(TagAction.ADD, null);
  }

  // when user clicks edit icon in <app-list>
  public onItemEdit(item: ListItem) {
    this.handleOpenModal(TagAction.EDIT, item.value);
  }

  // when user clicks delete icon in <app-list>
  public onItemDelete(item: ListItem) {
    this.handleOpenModal(TagAction.DELETE, item.value);
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
