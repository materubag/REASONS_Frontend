import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../core/services';
import { Publicacion } from '../../../../core/models';
import { resolveBackendUrl } from '../../../../core/utils/url';
import { flexibleSearchMatch } from '../../../../core/utils/search';

@Component({
  selector: 'app-publicaciones-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './publicaciones-page.html',
  styleUrl: './publicaciones-page.scss',
})
export class PublicacionesPage implements OnInit {
  publicaciones: Publicacion[] = [];
  filteredPublicaciones: Publicacion[] = [];
  availableYears: number[] = [];

  searchTerm = '';
  selectedYear: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPublicaciones();
  }

  private loadPublicaciones(): void {
    this.apiService.getPublicaciones(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          this.publicaciones = response.data || [];
          this.updateAvailableYears();
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
      },
    });
  }

  private updateAvailableYears(): void {
    const years = this.publicaciones.map(p => {
      const dateStr = p.createdAt || '';
      return dateStr ? new Date(dateStr).getFullYear() : null;
    }).filter((y): y is number => y !== null);

    const yearsFromAnio = this.publicaciones.map(p => p.anio).filter(Boolean);

    const combined = [...years, ...yearsFromAnio];
    this.availableYears = Array.from(new Set(combined)).sort((a, b) => b - a);
  }

  applyFilters(): void {
    let list = [...this.publicaciones];

    // Filter by year
    if (this.selectedYear !== null) {
      list = list.filter((p) => {
        const dateStr = p.createdAt || '';
        const createdYear = dateStr ? new Date(dateStr).getFullYear() : null;
        return createdYear === this.selectedYear || p.anio === this.selectedYear;
      });
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      list = list.filter((p) => {
        const keywordsStr = p.keywords ? p.keywords.join(' ') : '';
        return flexibleSearchMatch(
          [p.titulo, p.autores, p.resumen, p.revista, p.doi, keywordsStr],
          this.searchTerm
        );
      });
    }

    this.filteredPublicaciones = list;
  }

  selectYear(year: number | null): void {
    this.selectedYear = year;
    this.applyFilters();
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }

  getLimitedResumen(resumen?: string, limit: number = 300): string {
    if (!resumen) return '';
    const plainText = resumen.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (plainText.length <= limit) {
      return plainText;
    }
    return plainText.substring(0, limit) + '...';
  }
}
