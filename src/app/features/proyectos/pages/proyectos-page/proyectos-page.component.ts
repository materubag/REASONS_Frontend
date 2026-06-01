import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services';
import { Proyecto } from '../../../../core/models';
import { resolveBackendUrl } from '../../../../core/utils/url';
import { flexibleSearchMatch } from '../../../../core/utils/search';

@Component({
  selector: 'app-proyectos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proyectos-page.html',
  styleUrl: './proyectos-page.scss',
})
export class ProyectosPageComponent implements OnInit {
  proyectos: Proyecto[] = [];
  filteredProyectos: Proyecto[] = [];
  availableYears: number[] = [];

  searchTerm = '';
  selectedYear: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProyectos();
  }

  private loadProyectos(): void {
    this.apiService.getProyectos(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          this.proyectos = response.data || [];
          this.updateAvailableYears();
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
      },
    });
  }

  private getProjectYear(p: Proyecto): number | null {
    const dateStr = p.fechaInicio || p.createdAt || '';
    return dateStr ? new Date(dateStr).getFullYear() : null;
  }

  private updateAvailableYears(): void {
    const years = this.proyectos
      .map((p) => this.getProjectYear(p))
      .filter((y): y is number => y !== null);
    this.availableYears = Array.from(new Set(years)).sort((a, b) => b - a);
  }

  applyFilters(): void {
    let list = [...this.proyectos];

    // Filter by year
    if (this.selectedYear !== null) {
      list = list.filter((p) => {
        const projectYear = this.getProjectYear(p);
        return projectYear === this.selectedYear;
      });
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      list = list.filter((p) => {
        const keywordsStr = p.keywords ? p.keywords.join(' ') : '';
        return flexibleSearchMatch(
          [p.titulo, p.descripcion, p.objetivos, p.resultados, p.participantes, p.estado, keywordsStr],
          this.searchTerm
        );
      });
    }

    this.filteredProyectos = list;
  }

  selectYear(year: number | null): void {
    this.selectedYear = year;
    this.applyFilters();
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }

  getLimitedObjetivos(objetivos?: string): string {
    if (!objetivos) return '';
    const list = objetivos.split('\n').map(o => o.trim()).filter(Boolean);
    return list.slice(0, 3).join('\n');
  }

  getLimitedResultados(resultados?: string): string {
    if (!resultados) return '';
    // Strip HTML tags and normalize spacing
    const plainText = resultados.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (plainText.length <= 160) {
      return plainText;
    }
    return plainText.substring(0, 160) + '...';
  }
}
