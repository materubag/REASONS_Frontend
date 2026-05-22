export interface Investigador {
  id: number;
  nombre: string;
  email?: string;
  titulo?: string;
  descripcion?: string;
  correo?: string;
  biografia?: string;
  cargo?: string;
  foto?: string;
  orcid?: string;
  enlaces?: Record<string, string>;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  telegram?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  categorias?: string[];
  participantes?: string;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  objetivos?: string;
  resultados?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Publicacion {
  id: number;
  titulo: string;
  autores: string;
  resumen: string;
  anio: number;
  revista?: string;
  doi?: string;
  url?: string;
  categoria?: string;
  imagen?: string;
  pdf?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contacto {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  respondido: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GrupoInformacion {
  id: number;
  nombre: string;
  descripcion: string;
  objetivoGeneral?: string;
  objetivosEspecificos?: string;
  dominio?: string;
  direccion?: string;
  correo?: string;
  logo?: string;
  email?: string;
  ubicacion?: string;
  telefono?: string;
  sitioWeb?: string;
  misionVision?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LineaInvestigacion {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
