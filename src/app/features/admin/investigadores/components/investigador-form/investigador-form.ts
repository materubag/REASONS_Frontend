import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Investigador } from '../../../../../core/models';
import { resolveBackendUrl } from '../../../../../core/utils/url';
import { NotificationService } from '../../../../../core/services';

@Component({
  selector: 'app-investigador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './investigador-form.html',
  styleUrl: './investigador-form.scss',
})
export class InvestigadorForm implements OnInit {
  @Input() investigador?: Investigador;
  @Input() isSubmitting = false;
  @Output() submitForm = new EventEmitter<FormData>();

  readonly defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>👤</text></svg>";


  form!: FormGroup;
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  isDragOver = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.investigador) {
      this.populateForm(this.investigador);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      cargo: ['Investigador', [Validators.required]],
      biografia: ['', [Validators.required, Validators.minLength(10)]],
      correo: ['', [Validators.email]],
      orcid: ['', [Validators.pattern(/https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]/)]],
      linkedin: [''],
      facebook: [''],
      instagram: [''],
      telegram: [''],
    });
  }

  private populateForm(inv: Investigador): void {
    this.form.patchValue({
      nombre: inv.nombre,
      cargo: inv.cargo || 'Investigador',
      biografia: inv.biografia,
      correo: inv.correo || inv.email || '',
      orcid: inv.orcid || '',
      linkedin: inv.linkedin || '',
      facebook: inv.facebook || '',
      instagram: inv.instagram || '',
      telegram: inv.telegram || '',
    });

    if (inv.foto) {
      this.photoPreview = this.resolveBackendUrl(inv.foto);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.notificationService.error('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.notificationService.error('La imagen no debe superar 5MB');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.photoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const values = this.form.value;

    Object.keys(values).forEach((key) => {
      if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.submitForm.emit(formData);
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
