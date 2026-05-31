import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { Proyecto } from '../../../../../core/models';
import { ProyectoForm } from '../../components/proyecto-form/proyecto-form';
import { HasPendingChanges } from '../../../../../core/guards/pending-changes.guard';

@Component({
  selector: 'app-proyecto-edit',
  standalone: true,
  imports: [CommonModule, ProyectoForm],
  templateUrl: './proyecto-edit.html',
  styleUrl: './proyecto-edit.scss',
})
export class ProyectoEdit implements OnInit, HasPendingChanges {
  @ViewChild(ProyectoForm) formComponent!: ProyectoForm;

  proyecto?: Proyecto;
  id!: number;
  loading = true;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
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
      this.loadProyecto();
    } else {
      this.router.navigate(['/admin/proyectos/list']);
    }
  }

  private loadProyecto(): void {
    this.loading = true;
    this.apiService.getProyecto(this.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.proyecto = response.data;
        } else {
          this.notificationService.error('No se pudo encontrar el proyecto solicitado');
          this.router.navigate(['/admin/proyectos/list']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar proyecto:', error);
        this.notificationService.error('Error al conectar con el servidor para obtener la información del proyecto');
        this.router.navigate(['/admin/proyectos/list']);
        this.loading = false;
      },
    });
  }

  onSubmitForm(formData: FormData): void {
    this.isSubmitting = true;
    this.apiService.updateProyecto(this.id, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Cambios guardados correctamente');
          this.router.navigate(['/admin/proyectos/list']);
        } else {
          this.notificationService.error('Error al guardar cambios: ' + response.message);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Error al guardar cambios del proyecto:', error);
        const errorMsg = error.error?.message || 'Error al conectar con el servidor para guardar los cambios';
        this.notificationService.error(errorMsg);
        this.isSubmitting = false;
      },
    });
  }
}
