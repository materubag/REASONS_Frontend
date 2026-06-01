import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contacto } from '../../../../../core/models';

@Component({
  selector: 'app-contacto-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacto-table.html',
  styleUrl: './contacto-table.scss',
})
export class ContactoTable {
  @Input() contactos: Contacto[] = [];
  @Output() delete = new EventEmitter<number>();
  @Output() view = new EventEmitter<Contacto>();

  onView(contacto: Contacto): void {
    this.view.emit(contacto);
  }

  onDelete(id: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent opening view modal
    this.delete.emit(id);
  }
}
