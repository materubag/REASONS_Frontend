import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { Investigador } from '../../../../../core/models';
import { InvestigadorForm } from '../../components/investigador-form/investigador-form';

@Component({
  selector: 'app-investigador-edit',
  standalone: true,
  imports: [CommonModule, InvestigadorForm],
  templateUrl: './investigador-edit.html',
  styleUrl: './investigador-edit.scss',
})
export class InvestigadorEdit implements OnInit {
  investigador?: Investigador;
  id!: number;
  loading = true;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.loadInvestigador();
    } else {
      this.router.navigate(['/admin/investigadores/list']);
    }
  }

  private loadInvestigador(): void {
    this.loading = true;
    this.apiService.getInvestigador(this.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.investigador = response.data;
        } else {
          this.notificationService.error('No se pudo encontrar el investigador solicitado');
          this.router.navigate(['/admin/investigadores/list']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar investigador:', error);
        this.notificationService.error('Error al conectar con el servidor para obtener la información del investigador');
        this.router.navigate(['/admin/investigadores/list']);
        this.loading = false;
      },
    });
  }

  onSubmitForm(formData: FormData): void {
    this.isSubmitting = true;
    this.apiService.updateInvestigador(this.id, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Cambios guardados correctamente');
          this.router.navigate(['/admin/investigadores/list']);
        } else {
          this.notificationService.error('Error al guardar cambios: ' + response.message);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Error al guardar cambios del investigador:', error);
        const errorMsg = error.error?.message || 'Error al conectar con el servidor para guardar los cambios';
        this.notificationService.error(errorMsg);
        this.isSubmitting = false;
      },
    });
  }
}
