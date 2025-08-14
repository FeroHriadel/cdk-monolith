import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { TagsPageComponent } from './pages/tags/tags.component';
import { CategoriesPageComponent } from './pages/categories/categories.component';
import { ItemsPageComponent } from './pages/items/items.component';
import { SignupPageComponent } from './pages/signup/signup.component';
import { SigninPageComponent } from './pages/signin/signin.component';



export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'tags', component: TagsPageComponent },
  { path: 'categories', component: CategoriesPageComponent },
  { path: 'items', component: ItemsPageComponent },
  { path: 'signup', component: SignupPageComponent },
  { path: 'signin', component: SigninPageComponent }
];

