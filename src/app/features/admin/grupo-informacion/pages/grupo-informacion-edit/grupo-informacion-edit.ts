import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, NotificationService } from '../../../../../core/services';
import { GrupoInformacion } from '../../../../../core/models';
import { resolveBackendUrl } from '../../../../../core/utils/url';

@Component({
  selector: 'app-grupo-informacion-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './grupo-informacion-edit.html',
  styleUrl: './grupo-informacion-edit.scss',
})
export class GrupoInformacionEdit implements OnInit {
  form!: FormGroup;
  loading = true;
  isSubmitting = false;
  grupoInfo?: GrupoInformacion;
  logoPreview: string | null = null;
  selectedFile: File | null = null;
  isDragOver = false;
  objetivosEspecificos: string[] = [''];

  portadaPreview: string | null = null;
  selectedPortadaFile: File | null = null;

  miniLogoPreview: string | null = null;
  selectedMiniLogoFile: File | null = null;

  readonly defaultLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>🏢</text></svg>";
  readonly defaultPortada = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>🖼️</text></svg>";
  readonly defaultMiniLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>⭐</text></svg>";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadGrupoInformacion();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      objetivoGeneral: ['', [Validators.required, Validators.minLength(20)]],
      objetivosEspecificos: ['', [Validators.required, Validators.minLength(20)]],
      dominio: ['', [Validators.required, Validators.minLength(5)]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      metodologia: [''],
      facebook: [''],
      instagram: [''],
      mainColor: ['green'],
    });
  }

  private loadGrupoInformacion(): void {
    this.loading = true;
    this.apiService.getGrupoInformacion(1, 1).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.length > 0) {
          this.grupoInfo = response.data[0];
          this.populateForm(this.grupoInfo);
        } else {
          this.notificationService.info('No se encontró información del grupo en el servidor');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar grupo información:', error);
        this.notificationService.error('Error al conectar con el servidor para obtener los datos');
        this.loading = false;
      },
    });
  }

  private populateForm(info: GrupoInformacion): void {
    this.objetivosEspecificos = info.objetivosEspecificos ? info.objetivosEspecificos.split('\n').map(o => o.trim()).filter(Boolean) : [''];
    
    // Standardize theme selection with backward compatibility
    let themeColor = 'green';
    if (info.mainColor) {
      const lower = info.mainColor.toLowerCase().trim();
      if (lower === 'blue' || lower === '#15394f') {
        themeColor = 'blue';
      } else if (lower === 'gray') {
        themeColor = 'gray';
      } else if (lower === 'earth') {
        themeColor = 'earth';
      }
    }

    this.form.patchValue({
      nombre: info.nombre,
      descripcion: info.descripcion,
      objetivoGeneral: info.objetivoGeneral || '',
      objetivosEspecificos: info.objetivosEspecificos || '',
      dominio: info.dominio || '',
      correo: info.correo || info.email || '',
      direccion: info.direccion || '',
      metodologia: info.metodologia || '',
      facebook: info.facebook || '',
      instagram: info.instagram || '',
      mainColor: themeColor,
    });

    if (info.logo) {
      this.logoPreview = this.resolveBackendUrl(info.logo);
    }
    if (info.portada) {
      this.portadaPreview = this.resolveBackendUrl(info.portada);
    }
    if (info.miniLogo) {
      this.miniLogoPreview = this.resolveBackendUrl(info.miniLogo);
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
      this.notificationService.error('Por favor selecciona un logotipo de imagen válido');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.notificationService.error('La imagen del logotipo no debe superar 2MB');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  addObjective(): void {
    this.objetivosEspecificos.push('');
    this.updateObjetivosControl();
  }

  removeObjective(index: number): void {
    if (this.objetivosEspecificos.length > 1) {
      this.objetivosEspecificos.splice(index, 1);
    } else {
      this.objetivosEspecificos = [''];
    }
    this.updateObjetivosControl();
  }

  onObjectiveChange(index: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.objetivosEspecificos[index] = val;
    this.updateObjetivosControl();
  }

  updateObjetivosControl(): void {
    const joined = this.objetivosEspecificos.map(o => o.trim()).filter(Boolean).join('\n');
    this.form.get('objetivosEspecificos')?.setValue(joined);
    this.form.get('objetivosEspecificos')?.markAsTouched();
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  onSubmit(): void {
    this.updateObjetivosControl();

    if (this.form.invalid || !this.grupoInfo) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    const values = this.form.value;

    Object.keys(values).forEach((key) => {
      if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }
    if (this.selectedPortadaFile) {
      formData.append('portada', this.selectedPortadaFile);
    }
    if (this.selectedMiniLogoFile) {
      formData.append('miniLogo', this.selectedMiniLogoFile);
    }

    this.apiService.updateGrupoInformacion(this.grupoInfo.id, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Información del grupo guardada correctamente');
          if (response.data) {
            this.grupoInfo = response.data;
            this.populateForm(this.grupoInfo);

            // Apply selected theme instantly in the UI without refresh
            const mainColor = this.grupoInfo.mainColor;
            if (mainColor) {
              const themeVal = mainColor.toLowerCase().trim();
              if (themeVal === 'blue' || themeVal === '#15394f') {
                document.documentElement.setAttribute('data-theme', 'blue');
              } else if (themeVal === 'gray') {
                document.documentElement.setAttribute('data-theme', 'gray');
              } else if (themeVal === 'earth') {
                document.documentElement.setAttribute('data-theme', 'earth');
              } else {
                document.documentElement.removeAttribute('data-theme');
              }
            }
          }
        } else {
          this.notificationService.error('Error al guardar cambios: ' + response.message);
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error al actualizar grupo de información:', error);
        this.notificationService.error('Error al conectar con el servidor para guardar los cambios');
        this.isSubmitting = false;
      },
    });
  }

  onPortadaSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.notificationService.error('Por favor selecciona una imagen de portada válida');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.error('La imagen de portada no debe superar 5MB');
        return;
      }
      this.selectedPortadaFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.portadaPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onMiniLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.notificationService.error('Por favor selecciona un logotipo secundario válido');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.notificationService.error('La imagen del logotipo secundario no debe superar 2MB');
        return;
      }
      this.selectedMiniLogoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.miniLogoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
