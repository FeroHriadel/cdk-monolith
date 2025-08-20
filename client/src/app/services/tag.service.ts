import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Tag, GetTagsResponse, CreateTagRequest, CreateTagResponse, UpdateTagRequest, UpdateTagResponse, DeleteTagResponse } from "../models/tag.model";
import { map } from "rxjs/operators";
import { environment } from "../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";



@Injectable({
  providedIn: 'root'
})



export class TagService {
  private http = inject(HttpClient);
  public tagsSubject = new BehaviorSubject<Tag[]>([]); //the actual value: Tag[]
  public tags$ = this.tagsSubject.asObservable(); // the observable for components to subscribe to
  public apiUrl = environment.apiUrl;
  

  // Set tags
  setTags(tags: Tag[]) {
    this.tagsSubject.next(tags);
  }

  // Fetch tags from the server
  fetchTags() {
    this.http.get<GetTagsResponse>(`${this.apiUrl}/tags`).subscribe(response => {
      if (response.statusCode === 200) this.tagsSubject.next(response.data)
      else console.error('Failed to fetch tags:', response);
    });
  }

  // Add a new tag
  addTag(req: CreateTagRequest): Observable<CreateTagResponse> {
    return this.http.post<CreateTagResponse>(`${this.apiUrl}/tags`, req, {withCredentials: true});
  }

  // Update tag
  editTag(req: UpdateTagRequest): Observable<UpdateTagResponse> {
    return this.http.put<UpdateTagResponse>(`${this.apiUrl}/tags`, req, {withCredentials: true});
  }

  // Delete tag
  deleteTag(id: string): Observable<DeleteTagResponse> {
    return this.http.delete<DeleteTagResponse>(`${this.apiUrl}/tags/${id}`, {withCredentials: true});
  }


}