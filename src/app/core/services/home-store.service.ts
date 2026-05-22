import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';
import { GrupoInformacion, LineaInvestigacion, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class HomeStoreService {
  private readonly grupoCache = new Map<string, Observable<PaginatedResponse<GrupoInformacion>>>();
  private readonly lineasCache = new Map<string, Observable<PaginatedResponse<LineaInvestigacion>>>();

  constructor(private apiService: ApiService) {}

  getGrupoInformacion(page = 1, limit = 1): Observable<PaginatedResponse<GrupoInformacion>> {
    const key = `${page}:${limit}`;
    const cached = this.grupoCache.get(key);
    if (cached) {
      return cached;
    }

    const request$ = this.apiService.getGrupoInformacion(page, limit).pipe(
      catchError((error) => {
        this.grupoCache.delete(key);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.grupoCache.set(key, request$);
    return request$;
  }

  getLineasInvestigacion(page = 1, limit = 3): Observable<PaginatedResponse<LineaInvestigacion>> {
    const key = `${page}:${limit}`;
    const cached = this.lineasCache.get(key);
    if (cached) {
      return cached;
    }

    const request$ = this.apiService.getLineasInvestigacion(page, limit).pipe(
      catchError((error) => {
        this.lineasCache.delete(key);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.lineasCache.set(key, request$);
    return request$;
  }

  clearCache(): void {
    this.grupoCache.clear();
    this.lineasCache.clear();
  }
}
