import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { ProyectoForm } from '../../components/proyecto-form/proyecto-form';

@Component({
  selector: 'app-proyecto-create',
  standalone: true,
  imports: [CommonModule, ProyectoForm],
  templateUrl: './proyecto-create.html',
  styleUrl: './proyecto-create.scss',
})
export class ProyectoCreate {
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onSubmitForm(formData: FormData): void {
    this.isSubmitting = true;
    this.apiService.createProyecto(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Proyecto creado correctamente');
          this.router.navigate(['/admin/proyectos/list']);
        } else {
          this.notificationService.error('Error al crear proyecto: ' + response.message);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Error al crear proyecto:', error);
        const errorMsg = error.error?.message || 'Error al conectar con el servidor para crear el proyecto';
        this.notificationService.error(errorMsg);
        this.isSubmitting = false;
      },
    });
  }
}
