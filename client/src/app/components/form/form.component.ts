import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../../models/form.model';
import { MultiselectComponent } from '../multiselect/multiselect.component';



@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MultiselectComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  host: { 'style': 'width: 100%; max-width: 500px;' }
})



export class FormComponent {
  @Input() showSubmitButton = true;
  /** @required */
  @Input() formGroup!: FormGroup;
  /** @required */
  @Input() fields: FormField[] = [];
  /** @required */
  @Output() onSubmit = new EventEmitter<void>();
}
