import { inject, Injectable, signal } from "@angular/core";
import { User } from "../models/user.model";




@Injectable({
  providedIn: 'root'
})



export class LocalStorageService {

  public getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public removeUser() {
    localStorage.removeItem('user');
  }

}