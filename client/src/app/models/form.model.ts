import { ValidatorFn } from "@angular/forms";



export interface FormField {
  type: 'text' | 'email' | 'password' | 'file' | 'select' | 'multiselect';
  label: string;
  name: string;
  placeholder?: string;
  validators?: ValidatorFn[];

  // select and multiselect
  options?: { label: string; value: any }[];

  // multiselect
  selectedItems?: any[];
  title?: string;
  onItemClick?: (item: any) => void;

  // file input
  onFileSelected?: (event: Event) => void;
}