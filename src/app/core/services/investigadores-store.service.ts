import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Investigador, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class InvestigadoresStoreService {
  private readonly cache = new Map<string, Observable<PaginatedResponse<Investigador>>>();

  constructor(private apiService: ApiService) {}

  getInvestigadoresPage(page = 1, limit = 20): Observable<PaginatedResponse<Investigador>> {
    const key = `${page}:${limit}`;
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const request$ = this.apiService.getInvestigadores(page, limit).pipe(
      catchError((error) => {
        this.cache.delete(key);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.cache.set(key, request$);
    return request$;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
