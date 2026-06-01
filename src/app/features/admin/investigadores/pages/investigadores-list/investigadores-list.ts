import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { Investigador } from '../../../../../core/models';
import { resolveBackendUrl } from '../../../../../core/utils/url';
import { InvestigadorTable } from '../../components/investigador-table/investigador-table';
import { flexibleSearchMatch } from '../../../../../core/utils/search';
import { PaginationComponent } from '../../../../../shared/components';

@Component({
  selector: 'app-investigadores-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, InvestigadorTable, PaginationComponent],
  templateUrl: './investigadores-list.html',
  styleUrl: './investigadores-list.scss',
})
export class InvestigadoresList implements OnInit {
  investigadores: Investigador[] = [];
  filteredInvestigadores: Investigador[] = [];
  paginatedInvestigadores: Investigador[] = [];
  loading = true;

  // View state
  viewMode: 'grid' | 'table' = 'grid';

  // Search & Filters
  searchTerm = '';
  activeFilter: 'all' = 'all';

  // Pagination
  currentPage = 1;
  pageSize = 20;

  readonly defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>👤</text></svg>";

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadInvestigadores();
  }

  loadInvestigadores(): void {
    this.loading = true;
    this.apiService.getInvestigadores(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          this.investigadores = response.data || [];
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar investigadores:', error);
        this.notificationService.error('Error al cargar investigadores del servidor');
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let list = [...this.investigadores];

    // Filter by search term
    if (this.searchTerm.trim()) {
      list = list.filter((r) =>
        flexibleSearchMatch([r.nombre, r.cargo, r.biografia], this.searchTerm)
      );
    }

    this.filteredInvestigadores = list.sort((a, b) => a.id - b.id);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  updatePaginatedList(): void {
    this.paginatedInvestigadores = this.filteredInvestigadores.slice(
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

  setFilter(filter: 'all'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  switchView(mode: 'grid' | 'table'): void {
    this.viewMode = mode;
  }

  deleteInvestigador(id: number): void {
    this.notificationService.confirm({
      title: 'Eliminar Investigador',
      message: '¿Estás seguro que deseas eliminar este investigador? Esta acción no se puede deshacer.',
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.deleteInvestigador(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('Investigador eliminado correctamente');
              this.loadInvestigadores();
            } else {
              this.notificationService.error('No se pudo eliminar el investigador');
            }
          },
          error: (error) => {
            console.error('Error al eliminar investigador:', error);
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
