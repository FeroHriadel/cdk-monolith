import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormComponent } from "../../components/form/form.component";
import { FormService } from '../../services/form.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { timer } from 'rxjs';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, FormComponent, ToastrModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})



export class SigninPageComponent implements  OnInit {
  private userService = inject(UserService);
  private formService = inject(FormService);
  private toastr = inject(ToastrService);
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
  ];


  ngOnInit(): void {
    this.initForm();
  }
  

  // initialize signin form
  private initForm() {
    this.form = new FormGroup({
      Email: new FormControl('user01@email.com', [Validators.required, Validators.email]),
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

  // on form submit
  public onSubmit() {
    if (!this.canSubmit()) return;
    this.toggleLoading();
    this.userService.login(this.form.value).subscribe({
      next: (user) => { 
        this.toastr.success('Login successful', 'Success');
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


