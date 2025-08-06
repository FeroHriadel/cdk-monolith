import { JsonPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { FormComponent } from "../../components/form/form.component";


@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, FormComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})



export class SigninPageComponent implements  OnInit {
  public form: FormGroup = new FormGroup({});
  public fields = [
    { name: 'Email', 
      label: 'Email', 
      type: 'email' as 'email', 
      placeholder: 'Enter your email', 
      validators: [Validators.required, Validators.email] 
    },
    { name: 'UserName', 
      label: 'Username', 
      type: 'text' as 'text', 
      placeholder: 'Choose a username', 
      validators: [Validators.required, Validators.minLength(2)] 
    },
    { name: 'Password', 
      label: 'Password', 
      type: 'password' as 'password', 
      placeholder: 'Enter your password', 
      validators: [Validators.required, Validators.minLength(2)] 
    },
  ];
  private formService = inject(FormService);


  ngOnInit(): void {
    this.initForm();
  }
  

  // initialize signin form
  public initForm() {
    this.form = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      UserName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }

  // on form submit
  public onSubmit() {
    if (!this.formService.isFormValid(this.form)) return this.formService.showFormErrors(this.form);
    console.log(this.form.value);
  }
}


