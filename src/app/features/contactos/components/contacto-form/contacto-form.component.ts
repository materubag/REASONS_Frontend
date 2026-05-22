import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services';

@Component({
  selector: 'app-contacto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
      <!-- Name -->
      <div>
        <label class="block text-sm font-semibold text-text-primary mb-2">Nombre</label>
        <input
          type="text"
          formControlName="nombre"
          placeholder="Dr. Jane Doe"
          class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span *ngIf="form.get('nombre')?.hasError('required') && form.get('nombre')?.touched" class="text-danger text-sm">
          El nombre es requerido
        </span>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-semibold text-text-primary mb-2">Email</label>
        <input
          type="email"
          formControlName="email"
          placeholder="jane.doe@university.edu"
          class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span
          *ngIf="form.get('email')?.hasError('required') && form.get('email')?.touched"
          class="text-danger text-sm"
        >
          El email es requerido
        </span>
        <span
          *ngIf="form.get('email')?.hasError('email') && form.get('email')?.touched"
          class="text-danger text-sm"
        >
          El email debe ser válido
        </span>
      </div>

      <!-- Subject -->
      <div>
        <label class="block text-sm font-semibold text-text-primary mb-2">Asunto</label>
        <input
          type="text"
          formControlName="asunto"
          placeholder="Research Collaboration Inquiry"
          class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <span
          *ngIf="form.get('asunto')?.hasError('required') && form.get('asunto')?.touched"
          class="text-danger text-sm"
        >
          El asunto es requerido
        </span>
      </div>

      <!-- Message -->
      <div>
        <label class="block text-sm font-semibold text-text-primary mb-2">Mensaje</label>
        <textarea
          formControlName="mensaje"
          placeholder="Please provide details about your inquiry..."
          rows="5"
          class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        ></textarea>
        <span
          *ngIf="form.get('mensaje')?.hasError('required') && form.get('mensaje')?.touched"
          class="text-danger text-sm"
        >
          El mensaje es requerido
        </span>
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <button
          type="submit"
          [disabled]="form.invalid || submitting"
          class="w-full btn-primary"
        >
          {{ submitting ? 'Enviando...' : 'Enviar Mensaje' }}
        </button>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="p-4 bg-success/10 border border-success text-success rounded-lg">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="p-4 bg-danger/10 border border-danger text-danger rounded-lg">
        {{ errorMessage }}
      </div>
    </form>
  `,
})
export class ContactoFormComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.crearContacto(this.form.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.';
          this.form.reset();
        }
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.errorMessage =
          error.error?.message || 'Error al enviar el mensaje. Intenta de nuevo.';
        this.submitting = false;
      },
    });
  }
}
