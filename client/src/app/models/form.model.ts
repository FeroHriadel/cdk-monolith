import { ValidatorFn } from "@angular/forms";



export interface FormField {
  type: 'text' | 'email' | 'password' | 'file';
  label: string;
  name: string;
  placeholder?: string;
  validators?: ValidatorFn[];
  onFileSelected?: (event: Event) => void;
}