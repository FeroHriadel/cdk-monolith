import { Component, TemplateRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NgIf, NgTemplateOutlet } from '@angular/common';



@Component({
  selector: 'app-modal',
  imports: [NgIf, NgTemplateOutlet],
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    trigger('fadeBackdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fadeDialog', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
  ],
})



export class ModalComponent {
  visible = false;
  modalContent!: TemplateRef<any>;


  // open modal
  open(content: TemplateRef<any>) {
    this.modalContent = content;
    this.visible = true;
  }

  // close modal
  close() {
    this.visible = false;
  }
}
