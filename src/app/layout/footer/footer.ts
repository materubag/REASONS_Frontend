import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeStoreService } from '../../core/services';
import { GrupoInformacion } from '../../core/models';
import { resolveBackendUrl } from '../../core/utils/url';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  grupoInformacion?: GrupoInformacion;

  constructor(private homeStore: HomeStoreService) {}

  ngOnInit() {
    this.loadGrupoInformacion();
  }

  private loadGrupoInformacion() {
    this.homeStore.getGrupoInformacion(1, 1).subscribe({
      next: (response) => {
        if (response.success && response.data.length > 0) {
          this.grupoInformacion = response.data[0];
        }
      },
      error: (error) => {
        console.error('Error loading grupo informacion in footer:', error);
      }
    });
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
