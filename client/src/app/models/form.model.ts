import { ValidatorFn } from "@angular/forms";



export interface FormField {
  type: 'text' | 'email' | 'password';
  label: string;
  name: string;
  placeholder?: string;
  validators?: ValidatorFn[];
}