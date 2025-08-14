import { Component, inject, effect } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { FormComponent } from '../../components/form/form.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, FormComponent, ToastrModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})



export class SignupPageComponent {
  // Properties
  private userService = inject(UserService);
  private formService = inject(FormService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  public form: FormGroup = new FormGroup({});
  public fields = [
    { name: 'Email', 
      label: 'Email', 
      type: 'email' as 'email', 
      placeholder: 'Enter your email', 
      validators: [Validators.required, Validators.email],
    },
    { name: 'Password', 
      label: 'Password', 
      type: 'password' as 'password', 
      placeholder: 'Enter your password', 
      validators: [Validators.required, Validators.minLength(2)]
    },
    {
      name: 'UserName',
      label: 'User name',
      type: 'text' as 'text',
      placeholder: 'Enter your user name',
      validators: [Validators.required, Validators.minLength(2)]
    }
  ];

  
  // Effects:
  private redirectEffect = effect(() => this.redirectIfLoggedIn());


  // Lifecycle
  constructor() {
    this.initForm();
  }


  // Methods

  // redirect signed-in user (used in `private redirectEffect` property)
  private redirectIfLoggedIn() {
    if (this.userService.user() !== null) {
      this.router.navigateByUrl('/');
    }
  }

  // initialize signup form
  private initForm() {
    this.form = new FormGroup({
      Email: new FormControl('user01@email.com', [Validators.required, Validators.email]),
      UserName: new FormControl('user01', [Validators.required, Validators.minLength(2)]),
      Password: new FormControl('123456', [Validators.required, Validators.minLength(2)]),
    });
  }

  // check if form can be submitted
  private canSubmit(): boolean {
    if (this.form.disabled) return false;
    if (!this.formService.isFormValid(this.form)) {
      this.formService.showFormErrors(this.form);
      return false;
    }
    return true;
  }

   // toggle loading state
  private toggleLoading() {
    this.form.disabled ? this.form.enable() : this.form.disable();
  }

  // on form submit => signup+in user
  public onSubmit() {
      if (!this.canSubmit()) return;
      this.toggleLoading();
      this.userService.signup(this.form.value).subscribe({
        next: (user) => { 
          this.toastr.success('Sign up successful', 'Success');
          timer(2000).subscribe(() => {
            this.toggleLoading();
          });
        },
        error: (error) => {
          this.toastr.error(error.error.message, 'Error');
          this.toggleLoading();
        },
      });
    }

}
