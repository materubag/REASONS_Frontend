import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../../../core/models';
import { resolveBackendUrl } from '../../../../core/utils/url';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
      <!-- Image -->
      <div class="mb-4 -m-6 mb-4" *ngIf="publicacion.imagen">
        <img
          [src]="resolveBackendUrl(publicacion.imagen)"
          [alt]="publicacion.titulo"
          class="w-full h-48 object-cover rounded-t-lg"
        />
      </div>

      <!-- Keywords & Year -->
      <div class="flex justify-between items-start gap-2 mb-4">
        <div class="flex flex-wrap gap-1">
          <span
            *ngFor="let keyword of (publicacion.keywords || [])"
            class="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full"
          >
            {{ keyword }}
          </span>
          <span
            *ngIf="!publicacion.keywords || publicacion.keywords.length === 0"
            class="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full"
          >
            Sostenibilidad
          </span>
        </div>
        <span class="text-xs font-semibold text-text-secondary flex-shrink-0">{{ publicacion.anio }}</span>
      </div>

      <!-- Content -->
      <h3 class="text-lg font-bold text-text-primary mb-2">{{ publicacion.titulo }}</h3>
      <p class="text-sm text-primary font-semibold mb-2">{{ publicacion.autores }}</p>
      <p class="text-text-secondary text-sm mb-4 flex-grow line-clamp-3">
        {{ publicacion.resumen }}
      </p>

      <!-- Links -->
      <div class="pt-4 border-t border-border flex gap-3">
        <a
          *ngIf="publicacion.doi"
          [href]="'https://doi.org/' + publicacion.doi"
          target="_blank"
          class="text-primary hover:text-primary-dark text-sm font-semibold transition"
        >
          DOI
        </a>
        <a
          *ngIf="publicacion.pdf"
          [href]="resolveBackendUrl(publicacion.pdf)"
          target="_blank"
          class="text-primary hover:text-primary-dark text-sm font-semibold transition"
        >
          PDF
        </a>
        <a
          *ngIf="publicacion.url"
          [href]="publicacion.url"
          target="_blank"
          class="text-primary hover:text-primary-dark text-sm font-semibold transition"
        >
          Link
        </a>
      </div>
    </div>
  `,
})
export class PublicacionCardComponent {
  @Input() publicacion!: Publicacion;

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
