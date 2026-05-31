import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { BACK_URL } from '../../../core/config/app-env';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Check for query parameters first
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userStr = urlParams.get('user');
      const error = urlParams.get('error');
      const email = urlParams.get('email');

      if (token && userStr) {
        localStorage.setItem('token', token);
        try {
          localStorage.setItem('user', decodeURIComponent(userStr));
        } catch (e) {
          console.error('Error parsing user data from callback:', e);
        }
        
        // Clean up the query params in URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        this.router.navigate(['/admin/investigadores/list']);
        return;
      }

      if (error) {
        if (error === 'not_authorized') {
          this.errorMessage = `El correo ${email ? decodeURIComponent(email) : ''} no está registrado como investigador autorizado en el grupo.`;
        } else if (error === 'email_not_provided') {
          this.errorMessage = 'Microsoft no proporcionó un correo electrónico válido para tu cuenta.';
        } else if (error === 'microsoft_auth_failed') {
          this.errorMessage = 'El inicio de sesión con Microsoft falló. Inténtalo de nuevo.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado al autenticar con Microsoft.';
        }
        // Clean up the query params in URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // Si ya está logueado, redirige directamente a investigadores
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/investigadores/list']);
      return;
    }
  }

  loginWithMicrosoft(): void {
    if (typeof window !== 'undefined') {
      window.location.href = `${BACK_URL}/auth/microsoft/login`;
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const { correo, password } = this.form.value;

    this.authService.login(correo, password).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.router.navigate(['/admin/investigadores/list']);
        } else {
          this.errorMessage = res.message || 'Error al iniciar sesión';
          this.isSubmitting = false;
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage = err.error?.message || 'Error al conectar con el servidor. Verifica tus credenciales.';
        this.isSubmitting = false;
      }
    });
  }
}
