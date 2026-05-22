import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../../../core/models';
import { resolveBackendUrl } from '../../../../core/utils/url';

@Component({
  selector: 'app-proyecto-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
      <!-- Image -->
      <div class="mb-4 -m-6 mb-4">
        <img
          [src]="
            proyecto.imagen
              ? resolveBackendUrl(proyecto.imagen)
              : 'assets/images/placeholder-proyecto.jpg'
          "
          [alt]="proyecto.titulo"
          class="w-full h-48 object-cover rounded-t-lg"
        />
      </div>

      <!-- Categories -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          *ngFor="let categoria of (proyecto.categorias || [])"
          class="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full"
        >
          {{ categoria }}
        </span>
      </div>

      <!-- Content -->
      <h3 class="text-xl font-bold text-text-primary mb-2">{{ proyecto.titulo }}</h3>
      <p class="text-text-secondary text-sm mb-4 flex-grow">{{ proyecto.descripcion }}</p>

      <!-- Metadata -->
      <div class="pt-4 border-t border-border space-y-2 text-sm text-text-secondary">
        <p *ngIf="proyecto.participantes">
          <span class="font-semibold">Participantes:</span> {{ proyecto.participantes }}
        </p>
        <p *ngIf="proyecto.estado">
          <span class="font-semibold">Estado:</span> {{ proyecto.estado }}
        </p>
      </div>
    </div>
  `,
})
export class ProyectoCardComponent {
  @Input() proyecto!: Proyecto;

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
