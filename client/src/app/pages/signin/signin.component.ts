import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { FormComponent } from "../../components/form/form.component";
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, FormComponent, ToastrModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})



export class SigninPageComponent implements  OnInit {
  private loading = false;
  private userService = inject(UserService);
  private formService = inject(FormService);
  private toastr = inject(ToastrService);
  public form: FormGroup = new FormGroup({});
  public fields = [
    { name: 'Email', 
      label: 'Email', 
      type: 'email' as 'email', 
      placeholder: 'Enter your email', 
      validators: [Validators.required, Validators.email] 
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
  public initForm() {
    this.form = new FormGroup({
      Email: new FormControl('user01@email.com', [Validators.required, Validators.email]),
      Password: new FormControl('123456', [Validators.required, Validators.minLength(2)]),
    });
  }

  // on form submit
  public onSubmit() {
    if (this.loading) return;
    if (!this.formService.isFormValid(this.form)) return this.formService.showFormErrors(this.form);
    this.loading = true;
    this.userService.login(this.form.value).subscribe({
      next: (user) => this.toastr.success('Login successful', 'Success'),
      error: (error) => { this.toastr.error(error.message, 'Error'); this.loading = false; },
    });
  }
}


