import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../../core/services';

@Component({
  selector: 'app-linea-investigacion-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './linea-investigacion-create.html',
  styleUrl: './linea-investigacion-create.scss',
})
export class LineaInvestigacionCreate implements OnInit {
  form!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.apiService.createLineaInvestigacion(this.form.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/grupo-informacion/lineas']);
        } else {
          alert('Error al crear línea de investigación: ' + response.message);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Error al crear línea de investigación:', error);
        alert('Error al conectar con el servidor para crear la línea de investigación');
        this.isSubmitting = false;
      },
    });
  }
}
