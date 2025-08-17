import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Tag, GetTagsResponse } from "../models/tag.model";
import { map } from "rxjs/operators";
import { environment } from "../environments/environment";
import { BehaviorSubject } from "rxjs";



@Injectable({
  providedIn: 'root'
})



export class TagService {
  private http = inject(HttpClient);
  private tagsSubject = new BehaviorSubject<Tag[]>([]); //the actual value - private so only service can modify it
  public tags$ = this.tagsSubject.asObservable(); // the observable for components to subscribe to
  public apiUrl = environment.apiUrl;
  

  // Fetch tags from the server
  fetchTags() {
    this.http.get<GetTagsResponse>(`${this.apiUrl}/tags`).subscribe(response => {
      if (response.statusCode === 200) this.tagsSubject.next(response.data)
      else console.error('Failed to fetch tags:', response);
    });
  }



}