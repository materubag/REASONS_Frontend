import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Proyecto } from '../../../../../core/models';
import { resolveBackendUrl } from '../../../../../core/utils/url';

@Component({
  selector: 'app-proyecto-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './proyecto-table.html',
  styleUrl: './proyecto-table.scss',
})
export class ProyectoTable {
  @Input() proyectos: Proyecto[] = [];
  @Output() delete = new EventEmitter<number>();

  readonly defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>📂</text></svg>";

  onDelete(id: number): void {
    this.delete.emit(id);
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
