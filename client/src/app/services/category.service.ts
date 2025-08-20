import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Tag, GetTagsResponse, CreateTagRequest, CreateTagResponse, UpdateTagRequest, UpdateTagResponse, DeleteTagResponse } from "../models/tag.model";
import { map } from "rxjs/operators";
import { environment } from "../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { Category, GetCategoriesResponse, CreateCategoryRequest, CategoryCreateResponse, UpdateCategoryRequest, UpdateCategoryResponse, DeleteCategoryResponse } from "../models/category.model";



@Injectable({
  providedIn: 'root'
})



export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categories`;
  public categories = signal<Category[]>([]);


  // get categories and set categories$ signal
  public getCategories(): void {
    this.http.get<GetCategoriesResponse>(this.apiUrl).subscribe({
      next: (response) => {
        this.categories.set(response.data);
      },
      error: (error) => {
        console.error("Error fetching categories:", error);
      }
    });
  }

  // create category - gets object as request then converts it to FormData
  public createCategory(req: CreateCategoryRequest): Observable<CategoryCreateResponse> {
    const formData = new FormData();
    formData.append("Name", req.Name);
    formData.append("Description", req.Description || 'No description');
    formData.append("File", req.File);
    return this.http.post<CategoryCreateResponse>(this.apiUrl, formData, { withCredentials: true });
  }

  // update category - gets object as request then converts it to FormData
  public updateCategory(req: UpdateCategoryRequest): Observable<UpdateCategoryResponse> {
    const formData = new FormData();
    if (req.Name) formData.append("Name", req.Name);
    if (req.Description) formData.append("Description", req.Description || '');
    if (req.File) formData.append("File", req.File);
    return this.http.put<UpdateCategoryResponse>(`${this.apiUrl}/${req.id}`, formData, {withCredentials: true});
  }

  // delete category - gets id as parameter
  public deleteCategory(id: number): Observable<DeleteCategoryResponse> {
    return this.http.delete<DeleteCategoryResponse>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  public setCategories(categories: Category[]): void {
    this.categories.set(categories);
  }

}