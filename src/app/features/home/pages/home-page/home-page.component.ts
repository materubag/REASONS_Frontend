import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, InvestigadoresStoreService } from '../../../../core/services';
import { GrupoInformacion, Investigador, LineaInvestigacion } from '../../../../core/models';
import { resolveBackendUrl } from '../../../../core/utils/url';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent implements OnInit {
  grupoInformacion?: GrupoInformacion;
  lineasInvestigacion: LineaInvestigacion[] = [];
  director?: Investigador;
  subdirector?: Investigador;
  copiedEmailKey: 'director' | 'subdirector' | null = null;

  constructor(
    private apiService: ApiService,
    private investigadoresStore: InvestigadoresStoreService
  ) {}

  ngOnInit(): void {
    this.loadGrupoInformacion();
    this.loadLineasInvestigacion();
    this.loadDirectivos();
  }

  private loadGrupoInformacion(): void {
    this.apiService.getGrupoInformacion(1, 1).subscribe({
      next: (response) => {
        if (response.success && response.data.length > 0) {
          this.grupoInformacion = response.data[0];
        }
      },
      error: (error) => {
        console.error('Error loading grupo informacion:', error);
      },
    });
  }

  private loadLineasInvestigacion(): void {
    this.apiService.getLineasInvestigacion(1, 3).subscribe({
      next: (response) => {
        if (response.success) {
          this.lineasInvestigacion = [...response.data].sort((a, b) => a.id - b.id);
        }
      },
      error: (error) => {
        console.error('Error loading lineas de investigacion:', error);
      },
    });
  }

  private loadDirectivos(): void {
    this.investigadoresStore.getInvestigadoresPage(1, 20).subscribe({
      next: (response) => {
        if (response.success) {
          const investigadores = [...response.data].sort((a, b) => a.id - b.id);
          const normalize = (value?: string) => (value || '').toLowerCase();
          this.director = investigadores.find((item) => {
            const cargo = normalize(item.cargo);
            return cargo.includes('director') && !cargo.includes('subdirector');
          }) || investigadores.find((item) => item.id === 1);
          this.subdirector = investigadores.find((item) => {
            const cargo = normalize(item.cargo);
            return cargo.includes('subdirector');
          }) || investigadores.find((item) => item.id === 2);
        }
      },
      error: (error) => {
        console.error('Error loading investigadores:', error);
      },
    });
  }

  copyEmail(email: string | undefined, key: 'director' | 'subdirector'): void {
    if (!email) {
      return;
    }
    navigator.clipboard
      .writeText(email)
      .then(() => {
        this.copiedEmailKey = key;
        setTimeout(() => {
          if (this.copiedEmailKey === key) {
            this.copiedEmailKey = null;
          }
        }, 1500);
      })
      .catch(() => {
        this.copiedEmailKey = null;
      });
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
