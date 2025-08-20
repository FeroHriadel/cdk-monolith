import { Component, inject, OnInit, effect } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ListComponent } from '../../components/list/list.component';
import { Category } from '../../models/category.model';
import { ListItem } from '../../models/list.model';




@Component({
  selector: 'app-categories',
  imports: [ListComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})



export class CategoriesPageComponent implements OnInit {
  // services
  public categoryService = inject(CategoryService);

  // categories
  public categories: Category[] = [];
  public categoriesList: ListItem[] = []; //mapped categories for <app-list> component

  
  // lifecycle
  ngOnInit(): void {
    this.categoryService.getCategories();
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

}
