import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { GrupoInformacion, LineaInvestigacion, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HomeStoreService {
  private readonly grupoCache = new Map<string, PaginatedResponse<GrupoInformacion>>();
  private readonly lineasCache = new Map<string, PaginatedResponse<LineaInvestigacion>>();

  constructor(private apiService: ApiService) {}

  getGrupoInformacion(page = 1, limit = 1): Observable<PaginatedResponse<GrupoInformacion>> {
    const key = `${page}:${limit}`;
    const cached = this.grupoCache.get(key);
    if (cached) {
      return of(cached);
    }

    return this.apiService.getGrupoInformacion(page, limit).pipe(
      tap((response) => {
        if (response.success) {
          this.grupoCache.set(key, response);
        }
      })
    );
  }

  getLineasInvestigacion(page = 1, limit = 3): Observable<PaginatedResponse<LineaInvestigacion>> {
    const key = `${page}:${limit}`;
    const cached = this.lineasCache.get(key);
    if (cached) {
      return of(cached);
    }

    return this.apiService.getLineasInvestigacion(page, limit).pipe(
      tap((response) => {
        if (response.success) {
          this.lineasCache.set(key, response);
        }
      })
    );
  }

  clearCache(): void {
    this.grupoCache.clear();
    this.lineasCache.clear();
  }
}
