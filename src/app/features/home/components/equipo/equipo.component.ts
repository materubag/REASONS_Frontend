import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestigadoresStoreService } from '../../../../core/services';
import { Investigador } from '../../../../core/models';
import { LoadingComponent } from '../../../../shared/components';
import { resolveBackendUrl } from '../../../../core/utils/url';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <div class="py-16 md:py-24 bg-background">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-12 md:mb-16 text-center">
          <h2 class="section-title">Equipo de Trabajo</h2>
          <p class="section-subtitle">
            Conoce a los investigadores y profesionales que impulsan las iniciativas de
            sostenibilidad, ingeniería e innovación dentro del grupo de investigación REASONS.
          </p>
        </div>

        <app-loading *ngIf="loading"></app-loading>

        <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            *ngFor="let investigador of investigadores"
            class="card hover:shadow-xl cursor-pointer transition-all"
          >
            <!-- Image -->
            <div class="mb-6 -m-6 mb-0">
              <img
                [src]="
                  investigador.foto
                    ? resolveBackendUrl(investigador.foto)
                    : 'assets/images/placeholder.jpg'
                "
                [alt]="investigador.nombre"
                class="w-full h-48 object-cover rounded-t-lg"
              />
            </div>

            <!-- Content -->
            <div class="mt-6">
              <h3 class="text-xl font-bold text-text-primary mb-1">{{ investigador.nombre }}</h3>
              <p class="text-primary font-semibold text-sm mb-3">{{ investigador.titulo }}</p>
              <p class="text-text-secondary text-sm mb-4 line-clamp-3">
                {{ investigador.descripcion }}
              </p>

              <!-- Contact Info -->
              <div class="flex gap-3 pt-4 border-t border-border">
                <a
                  *ngIf="investigador.orcid"
                  [href]="investigador.orcid"
                  target="_blank"
                  class="text-primary hover:text-primary-dark transition flex items-center gap-1"
                  title="ORCID"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zM7.5 8c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm8.5 11h-3v-5.5c0-2-1-3-2.5-3C9 10.5 8 11.5 8 13.5V19H5V9h3v1.5c.5-1 1.5-2.5 3.5-2.5 2.5 0 4.5 1.5 4.5 5V19z"
                    />
                  </svg>
                </a>
                <a
                  [href]="'mailto:' + investigador.email"
                  class="text-primary hover:text-primary-dark transition"
                  title="Email"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                    ></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && investigadores.length === 0" class="text-center py-12">
          <p class="text-text-secondary">No hay investigadores disponibles</p>
        </div>
      </div>
    </div>
  `,
})
export class EquipoComponent implements OnInit {
  investigadores: Investigador[] = [];
  loading = true;

  constructor(private investigadoresStore: InvestigadoresStoreService) {}

  ngOnInit(): void {
    this.loadInvestigadores();
  }

  private loadInvestigadores(): void {
    this.investigadoresStore.getInvestigadoresPage(1, 20).subscribe({
      next: (response) => {
        if (response.success) {
          this.investigadores = response.data.slice(0, 12);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading investigadores:', error);
        this.loading = false;
      },
    });
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
