import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config/app-env';
import {
  Investigador,
  Proyecto,
  Publicacion,
  Contacto,
  GrupoInformacion,
  LineaInvestigacion,
  PaginatedResponse,
  ApiResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = API_URL;

  constructor(private http: HttpClient) {}

  /**
   * INVESTIGADORES
   */
  getInvestigadores(page = 1, limit = 10): Observable<PaginatedResponse<Investigador>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Investigador>>(
      `${this.API_URL}/investigadores`,
      { params }
    );
  }

  getInvestigador(id: number): Observable<ApiResponse<Investigador>> {
    return this.http.get<ApiResponse<Investigador>>(`${this.API_URL}/investigadores/${id}`);
  }

  /**
   * PROYECTOS
   */
  getProyectos(page = 1, limit = 10): Observable<PaginatedResponse<Proyecto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Proyecto>>(`${this.API_URL}/proyectos`, { params });
  }

  getProyecto(id: number): Observable<ApiResponse<Proyecto>> {
    return this.http.get<ApiResponse<Proyecto>>(`${this.API_URL}/proyectos/${id}`);
  }

  /**
   * PUBLICACIONES
   */
  getPublicaciones(page = 1, limit = 10): Observable<PaginatedResponse<Publicacion>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Publicacion>>(`${this.API_URL}/publicaciones`, {
      params,
    });
  }

  getPublicacion(id: number): Observable<ApiResponse<Publicacion>> {
    return this.http.get<ApiResponse<Publicacion>>(`${this.API_URL}/publicaciones/${id}`);
  }

  /**
   * CONTACTOS
   */
  crearContacto(contacto: Omit<Contacto, 'id' | 'createdAt' | 'updatedAt' | 'leido' | 'respondido'>): Observable<ApiResponse<Contacto>> {
    return this.http.post<ApiResponse<Contacto>>(`${this.API_URL}/contactos`, contacto);
  }

  /**
   * GRUPO INFORMACIÓN
   */
  getGrupoInformacion(page = 1, limit = 10): Observable<PaginatedResponse<GrupoInformacion>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<GrupoInformacion>>(
      `${this.API_URL}/grupo-informacion`,
      { params }
    );
  }

  /**
   * LINEAS DE INVESTIGACION
   */
  getLineasInvestigacion(page = 1, limit = 10): Observable<PaginatedResponse<LineaInvestigacion>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<LineaInvestigacion>>(
      `${this.API_URL}/lineas-investigacion`,
      { params }
    );
  }
}
