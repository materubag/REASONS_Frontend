import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../../../core/services';
import { PublicacionForm } from '../../components/publicacion-form/publicacion-form';

@Component({
  selector: 'app-publicacion-create',
  standalone: true,
  imports: [CommonModule, PublicacionForm],
  templateUrl: './publicacion-create.html',
  styleUrl: './publicacion-create.scss',
})
export class PublicacionCreate {
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onSubmitForm(formData: FormData): void {
    this.isSubmitting = true;
    this.apiService.createPublicacion(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/publicaciones/list']);
        } else {
          alert('Error al crear publicación: ' + response.message);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Error al crear publicación:', error);
        alert('Error al conectar con el servidor para crear la publicación');
        this.isSubmitting = false;
      },
    });
  }
}
