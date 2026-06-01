import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services';
import { Publicacion } from '../../../../core/models';
import { resolveBackendUrl } from '../../../../core/utils/url';

@Component({
  selector: 'app-publicacion-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './publicacion-detail-page.component.html',
})
export class PublicacionDetailPageComponent implements OnInit {
  publicacion: Publicacion | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadPublicacion(id);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  private loadPublicacion(id: number): void {
    this.loading = true;
    this.error = false;
    this.apiService.getPublicacion(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.publicacion = response.data;
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle de la publicación:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
