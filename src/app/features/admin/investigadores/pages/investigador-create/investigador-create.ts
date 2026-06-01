import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { InvestigadorForm } from '../../components/investigador-form/investigador-form';

@Component({
  selector: 'app-investigador-create',
  standalone: true,
  imports: [CommonModule, InvestigadorForm],
  templateUrl: './investigador-create.html',
  styleUrl: './investigador-create.scss',
})
export class InvestigadorCreate {
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onSubmitForm(formData: FormData): void {
    this.isSubmitting = true;
    this.apiService.createInvestigador(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Investigador creado correctamente');
          this.router.navigate(['/admin/investigadores/list']);
        } else {
          this.notificationService.error('Error al crear investigador: ' + response.message);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Error al crear investigador:', error);
        const errorMsg = error.error?.message || 'Error al conectar con el servidor para crear el investigador';
        this.notificationService.error(errorMsg);
        this.isSubmitting = false;
      },
    });
  }
}
