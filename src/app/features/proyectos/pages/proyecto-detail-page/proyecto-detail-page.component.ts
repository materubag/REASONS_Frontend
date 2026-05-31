import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../../../core/services';
import { Proyecto } from '../../../../core/models';
import { resolveBackendUrl } from '../../../../core/utils/url';

@Component({
  selector: 'app-proyecto-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proyecto-detail-page.component.html',
  styles: [`
    ::ng-deep .rich-text-display {
      word-break: break-word !important;
      overflow-wrap: break-word !important;
      max-width: 100% !important;
      text-align: justify;

      h1 {
        display: block;
        font-size: 1.5rem !important;
        font-weight: 700 !important;
        margin-top: 1rem !important;
        margin-bottom: 0.5rem !important;
        color: #0A1F4D !important;
      }
      h2 {
        display: block;
        font-size: 1.25rem !important;
        font-weight: 600 !important;
        margin-top: 0.875rem !important;
        margin-bottom: 0.5rem !important;
        color: #0A1F4D !important;
      }
      p {
        margin-bottom: 0.75rem !important;
      }
      ul, ol {
        margin-left: 1.5rem !important;
        margin-bottom: 0.75rem !important;
      }
      ul {
        list-style-type: disc !important;
      }
      ol {
        list-style-type: decimal !important;
      }
      a {
        color: #00639B !important;
        text-decoration: underline !important;
        font-weight: 500 !important;
      }
      img {
        max-width: 100% !important;
        height: auto !important;
      }
    }

    /* Dark mode overrides for rich text display */
    ::ng-deep .dark .rich-text-display {
      *, span, p, font {
        color: #cccccc !important;
      }
      h1, h2, h3, h4, h5, h6, strong, b {
        color: #ffffff !important;
      }
      h1 *, h2 *, h3 *, h4 *, h5 *, h6 *, strong *, b * {
        color: #ffffff !important;
      }
      a, a * {
        color: #60a5fa !important;
      }
    }
  `]
})
export class ProyectoDetailPageComponent implements OnInit {
  proyecto: Proyecto | null = null;
  safeDescripcionExtendida: SafeHtml | null = null;
  safeResultados: SafeHtml | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProyecto(id);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private loadProyecto(id: number): void {
    this.loading = true;
    this.error = false;
    this.apiService.getProyecto(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.proyecto = response.data;
          this.safeDescripcionExtendida = this.proyecto.descripcionExtendida
            ? this.sanitizer.bypassSecurityTrustHtml(this.proyecto.descripcionExtendida)
            : null;
          this.safeResultados = this.proyecto.resultados
            ? this.sanitizer.bypassSecurityTrustHtml(this.proyecto.resultados)
            : null;
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle del proyecto:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }

  getObjetivosList(): string[] {
    if (!this.proyecto || !this.proyecto.objetivos) return [];
    return this.proyecto.objetivos.split('\n').map(o => o.trim()).filter(Boolean);
  }
}
