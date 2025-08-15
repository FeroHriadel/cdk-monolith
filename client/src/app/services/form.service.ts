import { ToastrService, ToastrModule } from 'ngx-toastr';
import { Injectable, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";



@Injectable({
  providedIn: 'root',
})



export class FormService {
  private toastr = inject(ToastrService);


  // get form errors
  getFormErrors(form: FormGroup): string[] {
    const errors: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) { 
        Object.keys(control.errors).forEach(errorKey => { errors.push(`${key} has error: ${errorKey}`); });
      }
    });
    return errors;
  }

  // show error message - either FormGroup errors or string message
  showError(error: FormGroup | string): void {
    if (typeof error === 'string') this.toastr.error(error, 'Error');
    else {
      const errors = this.getFormErrors(error);
      if (errors.length > 0) { this.toastr.error(errors.join(', '), 'Form Errors'); }
    }
  }

  // show success message
  showSuccess(message: string) {
    this.toastr.success(message, 'Success');
  }

  //clear form inputs
  clearForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control) { control.setErrors(null);}
    });
  }

  // is form valid
  isFormValid(form: FormGroup): boolean { return form.valid; }
}