import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; //enables *ngIf
import { TagService } from '../../services/tag.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from '../../models/tag.model';
import { ListComponent } from '../../components/list/list.component';
import { ListItem } from '../../models/list.model';



@Component({
  selector: 'app-tags',
  imports: [CommonModule, ListComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.css'
})



export class TagsPageComponent implements OnInit {
  private tagService: TagService = inject(TagService);
  public tags$!: Observable<Tag[]>;
  public tagsList$!: Observable<ListItem[]>;


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

  // handles edit event from the list component
  public handleEdit(item: ListItem) {
    console.log('Edited item:', item);
  }

  // handles delete event from the list component
  public handleDelete(item: ListItem) {
    console.log('Deleted item:', item);
  }

  public handleAddTag() {
    console.log('Add new tag');
  }

}
