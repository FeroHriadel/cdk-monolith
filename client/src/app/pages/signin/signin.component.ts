import { JsonPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';


@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})



export class SigninPageComponent implements  OnInit {
  form: FormGroup = new FormGroup({});
  private formService = inject(FormService);

  
  ngOnInit(): void {
    this.initForm();
  }
  

  // initialize signin form
  initForm() {
    this.form = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      UserName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  // on form submit
  onSubmit() {
    if (!this.formService.isFormValid(this.form)) return this.formService.showFormErrors(this.form);
    console.log(this.form.value);
  }
}


