import { Directive, inject, Input, OnDestroy, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { UserService } from '../services/user.service';



@Directive({
  selector: '[appHasRole]' // prefix with `*` when used in components => *appHasRole
})



export class HasRoleDirective implements OnDestroy {
  @Input() appHasRole: string[] = [];
  private userService = inject(UserService);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);


  // effect to manage the view based on user roles
  private destroyEffect = effect(() => {
    const user = this.userService.user();
    const hasRole = user && this.appHasRole.some(role => user.roles?.includes(role));
    this.viewContainerRef.clear();
    if (hasRole) { this.viewContainerRef.createEmbeddedView(this.templateRef); }
  });


  // cleanup
  ngOnDestroy() {
    this.destroyEffect.destroy();
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
