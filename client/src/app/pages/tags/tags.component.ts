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


  ngOnInit() {
    this.tagService.fetchTags();
    this.tags$ = this.tagService.tags$;
    this.tagsList$ = this.tags$.pipe(map(tags => this.mapTagsToListItems(tags))); 
    // no need to unsubscribe - asyn pipe in html does it
  }


  // maps tags to list items that can be passed to the list component
  private mapTagsToListItems(tags: Tag[]): ListItem[] {
    return tags.map(tag => ({
      label: tag.name,
      value: tag
    }));
  }

  // handles open modal
  public handleOpenModal(action: TagAction) {
    this.tagAction = action;
    console.log(this.tagAction)
    this.modal.open(this.modalContent); // Pass the template to the modal
  }

  // handles add tag from the list component
  public handleAddTag() {
    console.log('Add new tag');
  }

  // handles edit tag from the list component
  public handleEdit(item: ListItem) {
    this.modal.close();
    console.log('Edited item:', item);
  }

  // handles delete tag from the list component
  public handleDelete(item: ListItem) {
    console.log('Deleted item:', item);
  }


}
