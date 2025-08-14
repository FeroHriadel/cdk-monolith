import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { User, UserLoginRequest, UserLoginResponse, UserSignupRequest } from "../models/user.model";
import { map } from "rxjs/operators";
import { environment } from "../environments/environment";
import { LocalStorageService } from "./localStorage.service";



@Injectable({
  providedIn: 'root'
})


/* This app doesn't send Auth token in headers but relies on http-only cookies sent by api/from browser for auth */
export class UserService {
  private localStorageService = inject(LocalStorageService);
  private http = inject(HttpClient);
  public user = signal<User | null>(null);
  public apiUrl = environment.apiUrl;
  

  // Login and store user in local storage (auth cooie will be set by api response)
  public login(loginRequest: UserLoginRequest) {
    // note the {withCredentials: true} - response cookie won't be set without it
    return this.http.post<UserLoginResponse>(`${this.apiUrl}/Users/login`, loginRequest, {withCredentials: true}).pipe(
      map(loginResponse => {
        if (!loginResponse) return;
        this.localStorageService.setUser(loginResponse.data);
        this.user.set(loginResponse.data);
        return loginResponse.data;
      })
    )
  }

  // Sign up and store user in local storage (auth cooie will be set by api response)
  public signup(signupRequest: UserSignupRequest) {
    return this.http.post<UserLoginResponse>(`${this.apiUrl}/Users`, signupRequest, {withCredentials: true}).pipe(
      map(signupResponse => {
        if (!signupResponse) return;
        this.localStorageService.setUser(signupResponse.data);
        this.user.set(signupResponse.data);
        return signupResponse.data;
      })
    )
  }

  // Refresh token - send a request with cookie? to api - if valid it will refresh the cookie & send user data
  public refreshToken() {
    return this.http.get<UserLoginResponse>(`${this.apiUrl}/Users/refreshtoken`, {withCredentials: true}).pipe(
      map(refreshResponse => {
        if (!refreshResponse) return;
        this.localStorageService.setUser(refreshResponse.data);
        this.user.set(refreshResponse.data);
        return refreshResponse.data;
      })
    )
  }

  // Logout user and remove from local storage
  public logout() {
    this.localStorageService.removeUser();
    this.user.set(null);
  }

}