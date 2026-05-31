import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../core/services';
import { Publicacion } from '../../../../../core/models';
import { PublicacionForm } from '../../components/publicacion-form/publicacion-form';
import { HasPendingChanges } from '../../../../../core/guards/pending-changes.guard';

@Component({
  selector: 'app-publicacion-edit',
  standalone: true,
  imports: [CommonModule, PublicacionForm],
  templateUrl: './publicacion-edit.html',
  styleUrl: './publicacion-edit.scss',
})
export class PublicacionEdit implements OnInit, HasPendingChanges {
  @ViewChild(PublicacionForm) formComponent!: PublicacionForm;

  publicacion?: Publicacion;
  id!: number;
  loading = true;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = true;
    }
  }

  hasUnsavedChanges(): boolean {
    return !!(this.formComponent?.form?.dirty && !this.isSubmitting);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.loadPublicacion();
    } else {
      this.router.navigate(['/admin/publicaciones/list']);
    }
  }

  private loadPublicacion(): void {
    this.loading = true;
    this.apiService.getPublicacion(this.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.publicacion = response.data;
        } else {
          alert('No se pudo encontrar la publicación solicitada');
          this.router.navigate(['/admin/publicaciones/list']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar publicación:', error);
        alert('Error al conectar con el servidor para obtener la información de la publicación');
        this.router.navigate(['/admin/publicaciones/list']);
        this.loading = false;
      },
    });
  }

  onSubmitForm(formData: FormData): void {
    this.isSubmitting = true;
    this.apiService.updatePublicacion(this.id, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/publicaciones/list']);
        } else {
          alert('Error al guardar cambios: ' + response.message);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Error al guardar cambios de la publicación:', error);
        alert('Error al conectar con el servidor para guardar los cambios');
        this.isSubmitting = false;
      },
    });
  }
}
