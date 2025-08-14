import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LocalStorageService } from './services/localStorage.service';
import { UserService } from './services/user.service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})



export class AppComponent implements OnInit {
  public title = 'client';
  private localStorageService = inject(LocalStorageService);
  private userService = inject(UserService);


  ngOnInit() {
    console.log('***************************')
    this.refreshSession();
  }


  private refreshSession() {
    const user = this.localStorageService.getUser();
    console.log(user)
    if (user) this.userService.refreshToken().subscribe({
      next: (data) => {
        console.log('Token refreshed:', data);
      },
      error: (error) => {
        console.error('Error refreshing token:', error);
      }
    })
  }
}
