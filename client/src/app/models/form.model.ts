import { ValidatorFn } from "@angular/forms";



export interface FormField {
  type: 'text' | 'email' | 'password' | 'file' | 'select';
  label: string;
  name: string;
  placeholder?: string;
  validators?: ValidatorFn[];
  options?: { label: string; value: any }[]; // For 'select' type
  onFileSelected?: (event: Event) => void;
}