import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Investigador, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class InvestigadoresStoreService {
  private readonly cache = new Map<string, PaginatedResponse<Investigador>>();

  constructor(private apiService: ApiService) {}

  getInvestigadoresPage(page = 1, limit = 20): Observable<PaginatedResponse<Investigador>> {
    const key = `${page}:${limit}`;
    const cached = this.cache.get(key);
    if (cached) {
      return of(cached);
    }

    return this.apiService.getInvestigadores(page, limit).pipe(
      tap((response) => {
        if (response.success) {
          this.cache.set(key, response);
        }
      })
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
