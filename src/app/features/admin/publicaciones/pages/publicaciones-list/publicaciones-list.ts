import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { Publicacion } from '../../../../../core/models';
import { resolveBackendUrl } from '../../../../../core/utils/url';
import { PublicacionTable } from '../../components/publicacion-table/publicacion-table';
import { flexibleSearchMatch } from '../../../../../core/utils/search';
import { PaginationComponent } from '../../../../../shared/components';

@Component({
  selector: 'app-publicaciones-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PublicacionTable, PaginationComponent],
  templateUrl: './publicaciones-list.html',
  styleUrl: './publicaciones-list.scss',
})
export class PublicacionesList implements OnInit {
  publicaciones: Publicacion[] = [];
  filteredPublicaciones: Publicacion[] = [];
  paginatedPublicaciones: Publicacion[] = [];
  loading = true;
  viewMode: 'grid' | 'table' = 'grid';
  searchTerm = '';

  // Pagination
  currentPage = 1;
  pageSize = 20;

  readonly defaultCover = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>📖</text></svg>";

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPublicaciones();
  }

  loadPublicaciones(): void {
    this.loading = true;
    this.apiService.getPublicaciones(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          this.publicaciones = response.data || [];
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
        this.notificationService.error('Error al cargar publicaciones del servidor');
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let list = [...this.publicaciones];

    if (this.searchTerm.trim()) {
      list = list.filter((p) =>
        flexibleSearchMatch([p.titulo, p.autores, p.resumen], this.searchTerm)
      );
    }

    this.filteredPublicaciones = list.sort((a, b) => a.id - b.id);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  updatePaginatedList(): void {
    this.paginatedPublicaciones = this.filteredPublicaciones.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  switchView(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  deletePublicacion(id: number): void {
    this.notificationService.confirm({
      title: 'Eliminar Publicación',
      message: '¿Estás seguro que deseas eliminar esta publicación? Esta acción no se puede deshacer.',
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.deletePublicacion(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('Publicación eliminada correctamente');
              this.loadPublicaciones();
            } else {
              this.notificationService.error('No se pudo eliminar la publicación');
            }
          },
          error: (error) => {
            console.error('Error al eliminar publicación:', error);
            this.notificationService.error('Error al conectar con el servidor');
          },
        });
      }
    });
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
