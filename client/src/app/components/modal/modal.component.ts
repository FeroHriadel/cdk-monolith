import { Component, TemplateRef, Output, EventEmitter, HostListener, Input, ElementRef } from '@angular/core';
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
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Input() modalButtons = false;
  visible = false;
  modalContent!: TemplateRef<any>;
  public elementRef: ElementRef;

  
  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }
  

  // open modal
  public open(content: TemplateRef<any>) {   
    this.modalContent = content;
    this.visible = true;
    this.opened.emit();
  }

  // close modal
  public close() {
    this.visible = false;
    this.closed.emit();
  }

  // confirm action
  public confirm() {
    this.visible = false;
    this.confirmed.emit();
  }

  // close modal on Esc
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  public onBackdropClick(event: MouseEvent): void {
    const dialog = this.elementRef.nativeElement.querySelector('.dialog');
    if (!dialog.contains(event.target as Node)) this.close();
  }

}
