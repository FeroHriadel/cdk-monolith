import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../services/user.service';



@Directive({
  selector: '[appHasRole]' // prefix with `*` when used in components => *appHasRole
})



export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  private userService = inject(UserService);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);


  ngOnInit() {
    if (this.hasRequiredRoles()) this.viewContainerRef.createEmbeddedView(this.templateRef);
    else this.viewContainerRef.clear();
  }


  // check if user has any of the required roles
  private hasRequiredRoles(): boolean {
    const userRoles = this.userService.getUserRoles();
    return this.appHasRole.some(role => userRoles?.includes(role));
  }

}



/*
USE LIKE THIS:

TS:
import { HasRoleDirective } from '../../directives/has-role.directive';
@Component({
  selector: 'app-list',
  imports: [NgIconsModule, HasRoleDirective],
  ...
})

HTML:
<button *appHasRole="['Admin', 'User']" class="btn btn-secondary btn-sm mx-1" (click)="onItemEdit.emit(item)">
*/
