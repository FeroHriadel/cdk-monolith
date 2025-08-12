import { Component, inject } from '@angular/core';
import { DropdownProps } from '../../models/dropdown.model';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-main-nav',
  imports: [DropdownComponent, RouterLink],
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.css'
})



export class MainNavComponent {
  private router: Router = inject(Router);
  public dropdownProps: DropdownProps = {
    buttonLabel: 'Menu',
    items: [
      { itemLabel: 'Home', itemValue: '/' },
      { itemLabel: 'Tags', itemValue: '/tags' },
      { itemLabel: 'Categories', itemValue: '/categories' },
      { itemLabel: 'Items', itemValue: '/items' }
    ],
    onClick: (itemValue: any) => {
      this.handleItemClick(itemValue);
    }
  };

  handleItemClick(itemValue: any) {
    if (typeof itemValue !== 'string') throw new Error('Item value must be a string representing a route');
    this.router.navigateByUrl(itemValue);
  }

  navigateToLogin() {
    this.router.navigateByUrl('/signin');
  }
}



