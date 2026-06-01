import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { LineaInvestigacion } from '../../../../../core/models';
import { flexibleSearchMatch } from '../../../../../core/utils/search';
import { PaginationComponent } from '../../../../../shared/components';

@Component({
  selector: 'app-linea-investigacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './linea-investigacion-list.html',
  styleUrl: './linea-investigacion-list.scss',
})
export class LineaInvestigacionList implements OnInit {
  lineas: LineaInvestigacion[] = [];
  filteredLineas: LineaInvestigacion[] = [];
  paginatedLineas: LineaInvestigacion[] = [];
  loading = true;
  searchTerm = '';

  // Pagination
  currentPage = 1;
  pageSize = 20;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadLineas();
  }

  loadLineas(): void {
    this.loading = true;
    this.apiService.getLineasInvestigacion(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          this.lineas = response.data || [];
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar líneas de investigación:', error);
        this.notificationService.error('Error al cargar las líneas de investigación del servidor');
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let list = [...this.lineas];

    if (this.searchTerm.trim()) {
      list = list.filter((l) =>
        flexibleSearchMatch([l.nombre, l.descripcion], this.searchTerm)
      );
    }

    this.filteredLineas = list.sort((a, b) => a.id - b.id);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  updatePaginatedList(): void {
    this.paginatedLineas = this.filteredLineas.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  deleteLinea(id: number): void {
    this.notificationService.confirm({
      title: 'Eliminar Línea',
      message: '¿Estás seguro que deseas eliminar esta línea de investigación? Esta acción no se puede deshacer y podría afectar la presentación en la página principal.',
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.deleteLineaInvestigacion(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('Línea de investigación eliminada correctamente');
              this.loadLineas();
            } else {
              this.notificationService.error('No se pudo eliminar la línea de investigación');
            }
          },
          error: (error) => {
            console.error('Error al eliminar línea de investigación:', error);
            this.notificationService.error('Error al conectar con el servidor');
          },
        });
      }
    });
  }
}

