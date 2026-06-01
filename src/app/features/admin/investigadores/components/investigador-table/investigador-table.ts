import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Investigador } from '../../../../../core/models';
import { resolveBackendUrl } from '../../../../../core/utils/url';

@Component({
  selector: 'app-investigador-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './investigador-table.html',
  styleUrl: './investigador-table.scss',
})
export class InvestigadorTable {
  @Input() investigadores: Investigador[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  readonly defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>👤</text></svg>";

  onEdit(id: number): void {
    this.edit.emit(id);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}

