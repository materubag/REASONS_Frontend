import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../../core/services';

@Component({
  selector: 'app-linea-investigacion-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './linea-investigacion-edit.html',
  styleUrl: './linea-investigacion-edit.scss',
})
export class LineaInvestigacionEdit implements OnInit {
  form!: FormGroup;
  id!: number;
  loading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.initForm();
      this.loadLinea();
    } else {
      this.router.navigate(['/admin/grupo-informacion/lineas']);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  private loadLinea(): void {
    this.loading = true;
    this.apiService.getLineaInvestigacion(this.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.form.patchValue({
            nombre: response.data.nombre,
            descripcion: response.data.descripcion,
          });
        } else {
          alert('No se pudo encontrar la línea de investigación solicitada');
          this.router.navigate(['/admin/grupo-informacion/lineas']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar línea de investigación:', error);
        alert('Error al conectar con el servidor para obtener los datos de la línea');
        this.router.navigate(['/admin/grupo-informacion/lineas']);
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.apiService.updateLineaInvestigacion(this.id, this.form.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/admin/grupo-informacion/lineas']);
        } else {
          alert('Error al guardar cambios: ' + response.message);
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Error al guardar cambios de la línea de investigación:', error);
        alert('Error al conectar con el servidor para guardar los cambios');
        this.isSubmitting = false;
      },
    });
  }
}
