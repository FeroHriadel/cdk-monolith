import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { Item, GetItemsQueryStringAsObject, GetItemsResponse, CreateItemRequest, CreateItemResponse } from "../models/item.model";
import { ListItem } from "../models/list.model";



@Injectable({
  providedIn: 'root'
})



export class ItemService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/items`;
  public items = signal<Item[]>([]);


  // set items signal
  public setItems(items: Item[]) {
    this.items.set(items);
  }

  // get Items from api, set items signal and return nothing
  public getItems(queryStringObj?: GetItemsQueryStringAsObject): void {
    const queryString: string = queryStringObj ? this.mapGetItemsObjectToQueryString(queryStringObj) : '';
    this.http.get<GetItemsResponse>(this.apiUrl + queryString)
      .subscribe({
        next: response => {
          if (response.statusCode !== 200) throw new Error(response.message || 'Failed to fetch items');
          this.items.set(response.data);
        },
        error: err => {
          console.error('Failed to fetch items:', err);
        }
      });
  }

  //so it can be passed to <app-list>
  public mapItemsToListItems(items: Item[]): ListItem[] {
    return items.map(item => ({ value: item, label: item.name }));
  }

  // Map query string as object {pageSize: 20, ...} to query string ?pageSize=20&...
  private mapGetItemsObjectToQueryString(obj: GetItemsQueryStringAsObject): string {
    const queryString = Object.keys(obj)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(obj[key]))}`)
      .join('&');
    return `?${queryString}`;
  }

  // Create a new item
  public createItem(request: CreateItemRequest): Observable<CreateItemResponse> {
    const formData = new FormData();
    formData.append('Name', request.Name);
    formData.append('Description', request.Description || 'No description');
    request.CategoryId && formData.append('CategoryId', String(request.CategoryId));
    request.TagIds?.length && request.TagIds.forEach(id => formData.append('tagIds', id));
    return this.http.post<CreateItemResponse>(this.apiUrl, formData, {withCredentials: true});
  }

  // Delete Item
  public deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {withCredentials: true});
  }
}
