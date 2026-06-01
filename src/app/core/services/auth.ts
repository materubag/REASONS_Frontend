import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../config/app-env';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly API_URL = API_URL;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Envía las credenciales al backend para iniciar sesión.
   * Al tener éxito, guarda el JWT token en localStorage.
   */
  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, { correo, password }).pipe(
      tap((res) => {
        if (res && res.success && res.token) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        }
      })
    );
  }

  /**
   * Cierra la sesión activa borrando el token y redirigiendo al login.
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }

  /**
   * Comprueba si el usuario tiene una sesión activa (token existente).
   * Valida la existencia de window para evitar errores durante el pre-renderizado de SSR.
   */
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  /**
   * Obtiene el token de JWT almacenado.
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Obtiene la información del usuario logueado.
   */
  getUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}
