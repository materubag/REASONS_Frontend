import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../../core/services';

@Component({
  selector: 'app-contactos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contactos-page.component.html',
})
export class ContactosPageComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  investigadorCorreos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      correo: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
    });

    this.apiService.getInvestigadores(1, 100).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.investigadorCorreos = res.data
            .map((inv) => (inv.correo || inv.email || '').trim().toLowerCase())
            .filter((correo) => correo !== '');
        }
      },
      error: (err) => {
        console.error('Error al cargar investigadores en la página de contactos:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;
    this.errorMessage = '';

    const emailValue = (this.form.value.correo || '').trim().toLowerCase();

    const forbiddenEmails = [
      'reasons@uta.edu.ec',
      'webmaster@uta.edu.ec',
      'contact@uta.edu.ec',
      'hcusecregeneral@uta.edu.ec',
      'gestiondinnova@uta.edu.ec'
    ];

    if (forbiddenEmails.includes(emailValue)) {
      this.errorMessage = 'No está permitido enviar mensajes con este correo institucional de contacto.';
      this.submitError = true;
      this.isSubmitting = false;
      return;
    }

    if (this.investigadorCorreos.includes(emailValue)) {
      this.errorMessage = 'Los investigadores registrados no pueden utilizar este formulario de contacto público.';
      this.submitError = true;
      this.isSubmitting = false;
      return;
    }

    this.apiService.crearContacto(this.form.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.submitSuccess = true;
          this.form.reset();
        } else {
          this.errorMessage = 'Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo.';
          this.submitError = true;
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error al enviar contacto:', error);
        this.errorMessage = error.error?.message || 'Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo.';
        this.submitError = true;
        this.isSubmitting = false;
      },
    });
  }
}
