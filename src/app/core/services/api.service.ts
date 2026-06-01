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

  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      }
    };
  }

  createInvestigador(formData: FormData): Observable<ApiResponse<Investigador>> {
    return this.http.post<ApiResponse<Investigador>>(
      `${this.API_URL}/investigadores`,
      formData,
      this.getAuthHeaders()
    );
  }

  updateInvestigador(id: number, formData: FormData): Observable<ApiResponse<Investigador>> {
    return this.http.put<ApiResponse<Investigador>>(
      `${this.API_URL}/investigadores/${id}`,
      formData,
      this.getAuthHeaders()
    );
  }

  deleteInvestigador(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.API_URL}/investigadores/${id}`,
      this.getAuthHeaders()
    );
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

  createProyecto(formData: FormData): Observable<ApiResponse<Proyecto>> {
    return this.http.post<ApiResponse<Proyecto>>(
      `${this.API_URL}/proyectos`,
      formData,
      this.getAuthHeaders()
    );
  }

  updateProyecto(id: number, formData: FormData): Observable<ApiResponse<Proyecto>> {
    return this.http.put<ApiResponse<Proyecto>>(
      `${this.API_URL}/proyectos/${id}`,
      formData,
      this.getAuthHeaders()
    );
  }

  deleteProyecto(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.API_URL}/proyectos/${id}`,
      this.getAuthHeaders()
    );
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

  createPublicacion(formData: FormData): Observable<ApiResponse<Publicacion>> {
    return this.http.post<ApiResponse<Publicacion>>(
      `${this.API_URL}/publicaciones`,
      formData,
      this.getAuthHeaders()
    );
  }

  updatePublicacion(id: number, formData: FormData): Observable<ApiResponse<Publicacion>> {
    return this.http.put<ApiResponse<Publicacion>>(
      `${this.API_URL}/publicaciones/${id}`,
      formData,
      this.getAuthHeaders()
    );
  }

  deletePublicacion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.API_URL}/publicaciones/${id}`,
      this.getAuthHeaders()
    );
  }


  /**
   * CONTACTOS
   */
  crearContacto(contacto: Omit<Contacto, 'id' | 'createdAt' | 'updatedAt' | 'leido' | 'respondido'>): Observable<ApiResponse<Contacto>> {
    return this.http.post<ApiResponse<Contacto>>(`${this.API_URL}/contactos`, contacto);
  }

  getContactos(page = 1, limit = 20): Observable<PaginatedResponse<Contacto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<PaginatedResponse<Contacto>>(`${this.API_URL}/contactos`, {
      params,
      ...this.getAuthHeaders()
    });
  }

  deleteContacto(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.API_URL}/contactos/${id}`,
      this.getAuthHeaders()
    );
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

  updateGrupoInformacion(id: number, formData: FormData): Observable<ApiResponse<GrupoInformacion>> {
    return this.http.patch<ApiResponse<GrupoInformacion>>(
      `${this.API_URL}/grupo-informacion/${id}`,
      formData,
      this.getAuthHeaders()
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

  getLineaInvestigacion(id: number): Observable<ApiResponse<LineaInvestigacion>> {
    return this.http.get<ApiResponse<LineaInvestigacion>>(`${this.API_URL}/lineas-investigacion/${id}`);
  }

  createLineaInvestigacion(linea: Omit<LineaInvestigacion, 'id'>): Observable<ApiResponse<LineaInvestigacion>> {
    return this.http.post<ApiResponse<LineaInvestigacion>>(
      `${this.API_URL}/lineas-investigacion`,
      linea,
      this.getAuthHeaders()
    );
  }

  updateLineaInvestigacion(id: number, linea: Omit<LineaInvestigacion, 'id'>): Observable<ApiResponse<LineaInvestigacion>> {
    return this.http.put<ApiResponse<LineaInvestigacion>>(
      `${this.API_URL}/lineas-investigacion/${id}`,
      linea,
      this.getAuthHeaders()
    );
  }

  deleteLineaInvestigacion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.API_URL}/lineas-investigacion/${id}`,
      this.getAuthHeaders()
    );
  }
}

