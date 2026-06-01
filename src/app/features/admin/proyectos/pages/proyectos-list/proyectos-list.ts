import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { Proyecto } from '../../../../../core/models';
import { resolveBackendUrl } from '../../../../../core/utils/url';
import { ProyectoTable } from '../../components/proyecto-table/proyecto-table';
import { flexibleSearchMatch } from '../../../../../core/utils/search';
import { PaginationComponent } from '../../../../../shared/components';

@Component({
  selector: 'app-proyectos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProyectoTable, PaginationComponent],
  templateUrl: './proyectos-list.html',
  styleUrl: './proyectos-list.scss',
})
export class ProyectosList implements OnInit {
  proyectos: Proyecto[] = [];
  filteredProyectos: Proyecto[] = [];
  paginatedProyectos: Proyecto[] = [];
  loading = true;
  viewMode: 'grid' | 'table' = 'grid';
  searchTerm = '';

  // Pagination
  currentPage = 1;
  pageSize = 20;

  readonly defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>📂</text></svg>";

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProyectos();
  }

  loadProyectos(): void {
    this.loading = true;
    this.apiService.getProyectos(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          this.proyectos = response.data || [];
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.notificationService.error('Error al cargar proyectos del servidor');
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let list = [...this.proyectos];

    if (this.searchTerm.trim()) {
      list = list.filter((p) =>
        flexibleSearchMatch([p.titulo, p.descripcion, p.objetivos], this.searchTerm)
      );
    }

    this.filteredProyectos = list.sort((a, b) => a.id - b.id);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  updatePaginatedList(): void {
    this.paginatedProyectos = this.filteredProyectos.slice(
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

  deleteProyecto(id: number): void {
    this.notificationService.confirm({
      title: 'Eliminar Proyecto',
      message: '¿Estás seguro que deseas eliminar este proyecto? Esta acción no se puede deshacer.',
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.deleteProyecto(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('Proyecto eliminado correctamente');
              this.loadProyectos();
            } else {
              this.notificationService.error('No se pudo eliminar el proyecto');
            }
          },
          error: (error) => {
            console.error('Error al eliminar proyecto:', error);
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
