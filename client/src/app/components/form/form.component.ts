import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../../models/form.model';



@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  host: { 'style': 'width: 100%; max-width: 500px;' }
})



export class FormComponent {
  /** @required */
  @Input() formGroup!: FormGroup;
  /** @required */
  @Input() fields: FormField[] = [];
  /** @required */
  @Output() onSubmit = new EventEmitter<void>();
}
