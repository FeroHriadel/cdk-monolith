import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { User, UserLoginRequest, UserSignupRequest } from "../models/user.model";
import { map } from "rxjs/operators";
import { environment } from "../environments/environment";



@Injectable({
  providedIn: 'root'
})



export class UserService {
  private http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  user = signal<User | null>(null);

  
  // Login and store user in local storage
  login(loginRequest: UserLoginRequest) {
    return this.http.post<User>(`${this.apiUrl}/Users/login`, loginRequest).pipe(
      map(user => {
        if (!user) return;
        localStorage.setItem('user', JSON.stringify(user));
        this.user.set(user);
        return user;
      })
    )
  }

  // Sign up a new user
  signup(signupRequest: UserSignupRequest) {
    return this.http.post<User>(`${this.apiUrl}/Users`, signupRequest).pipe(
      map(user => {
        if (!user) return;
        localStorage.setItem('user', JSON.stringify(user));
        this.user.set(user);
        return user;
      })
    )
  }

}