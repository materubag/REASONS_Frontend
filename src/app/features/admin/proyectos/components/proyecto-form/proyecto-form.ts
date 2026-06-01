import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Proyecto, Investigador, LineaInvestigacion } from '../../../../../core/models';
import { ApiService, NotificationService } from '../../../../../core/services';
import { resolveBackendUrl } from '../../../../../core/utils/url';
import { RichTextEditorComponent } from '../../../../../shared/components';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RichTextEditorComponent],
  templateUrl: './proyecto-form.html',
  styleUrl: './proyecto-form.scss',
})
export class ProyectoForm implements OnInit {
  @Input() proyecto?: Proyecto;
  @Input() isSubmitting = false;
  @Output() submitForm = new EventEmitter<FormData>();

  form!: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isDragOver = false;

  investigadoresList: Investigador[] = [];
  lineasList: LineaInvestigacion[] = [];

  // Dynamic Objectives and Keywords
  objetivos: string[] = [''];
  keywords: string[] = [];

  readonly defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>📂</text></svg>";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadResearchersAndLines();
    if (this.proyecto) {
      this.populateForm(this.proyecto);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      descripcionExtendida: [''],
      objetivos: ['', [Validators.required, Validators.minLength(10)]],
      resultados: [''],
      fechaInicio: [''],
      fechaFin: [''],
      keywords: [[]],
      investigadores: [[]],
      lineas: [[]],
    }, { validators: this.dateLessThanValidator });
  }

  dateLessThanValidator = (group: FormGroup): { [key: string]: any } | null => {
    const inicio = group.get('fechaInicio')?.value;
    const fin = group.get('fechaFin')?.value;
    const finControl = group.get('fechaFin');
    
    if (inicio && fin) {
      if (new Date(fin) < new Date(inicio)) {
        finControl?.setErrors({ datesInvalid: true });
        return { datesInvalid: true };
      }
    }
    
    if (finControl?.hasError('datesInvalid')) {
      finControl.setErrors(null);
    }
    return null;
  };

  private loadResearchersAndLines(): void {
    this.apiService.getInvestigadores(1, 100).subscribe({
      next: (res) => {
        this.investigadoresList = res.data;
      },
      error: (err) => console.error('Error al cargar investigadores:', err)
    });

    this.apiService.getLineasInvestigacion(1, 100).subscribe({
      next: (res) => {
        this.lineasList = res.data;
      },
      error: (err) => console.error('Error al cargar líneas de investigación:', err)
    });
  }

  private populateForm(proj: Proyecto): void {
    this.objetivos = proj.objetivos ? proj.objetivos.split('\n').map(o => o.trim()).filter(Boolean) : [''];
    this.keywords = proj.keywords || [];

    this.form.patchValue({
      titulo: proj.titulo,
      descripcion: proj.descripcion,
      descripcionExtendida: proj.descripcionExtendida || '',
      objetivos: proj.objetivos || '',
      resultados: proj.resultados || '',
      fechaInicio: proj.fechaInicio ? proj.fechaInicio.substring(0, 10) : '',
      fechaFin: proj.fechaFin ? proj.fechaFin.substring(0, 10) : '',
      keywords: this.keywords,
      investigadores: proj.investigadores ? proj.investigadores.map(i => i.id) : [],
      lineas: proj.lineas ? proj.lineas.map(l => l.id) : [],
    });

    if (proj.imagen) {
      this.imagePreview = this.resolveBackendUrl(proj.imagen);
    }
  }

  // Objectives Dynamic Helpers
  addObjective(): void {
    this.objetivos.push('');
    this.updateObjetivosControl();
  }

  removeObjective(index: number): void {
    if (this.objetivos.length > 1) {
      this.objetivos.splice(index, 1);
    } else {
      this.objetivos = [''];
    }
    this.updateObjetivosControl();
  }

  onObjectiveChange(index: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.objetivos[index] = val;
    this.updateObjetivosControl();
  }

  updateObjetivosControl(): void {
    const joined = this.objetivos.map(o => o.trim()).filter(Boolean).join('\n');
    this.form.get('objetivos')?.setValue(joined);
    this.form.get('objetivos')?.markAsTouched();
  }

  // Keywords Tags/Chips Helpers
  addKeyword(input: HTMLInputElement): void {
    const value = input.value.trim();
    if (value && !this.keywords.includes(value)) {
      this.keywords.push(value);
      this.form.get('keywords')?.setValue([...this.keywords]);
      this.form.get('keywords')?.markAsTouched();
    }
    input.value = '';
  }

  removeKeyword(index: number): void {
    this.keywords.splice(index, 1);
    this.form.get('keywords')?.setValue([...this.keywords]);
    this.form.get('keywords')?.markAsTouched();
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  editKeyword(index: number, input: HTMLInputElement): void {
    const kw = this.keywords[index];
    input.value = kw;
    this.removeKeyword(index);
    input.focus();
  }

  // Researchers Checkboxes Helpers
  toggleResearcher(id: number): void {
    const current = this.form.get('investigadores')?.value as number[] || [];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    this.form.get('investigadores')?.setValue([...current]);
    this.form.get('investigadores')?.markAsTouched();
  }

  isResearcherSelected(id: number): boolean {
    const current = this.form.get('investigadores')?.value as number[] || [];
    return current.includes(id);
  }

  // Research Lines Checkboxes Helpers
  toggleLine(id: number): void {
    const current = this.form.get('lineas')?.value as number[] || [];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    this.form.get('lineas')?.setValue([...current]);
    this.form.get('lineas')?.markAsTouched();
  }

  isLineSelected(id: number): boolean {
    const current = this.form.get('lineas')?.value as number[] || [];
    return current.includes(id);
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

    if (file.size > 10 * 1024 * 1024) {
      this.notificationService.error('La imagen no debe superar 10MB');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    // Ensure objetivos string is synced before validation check
    this.updateObjetivosControl();

    const descExtendida = this.form.get('descripcionExtendida')?.value || '';
    const resultados = this.form.get('resultados')?.value || '';

    const descMb = new Blob([descExtendida]).size / (1024 * 1024);
    const resMb = new Blob([resultados]).size / (1024 * 1024);

    if (descMb > 10 || resMb > 10) {
      const fieldName = descMb > 10 ? 'Descripción Extendida' : 'Resultados';
      this.notificationService.error(
        `El campo de ${fieldName} supera el límite de 10MB debido a las imágenes embebidas. Por favor, reduce el tamaño de las imágenes antes de guardar.`
      );
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (descMb > 5 || resMb > 5) {
      const fieldName = descMb > 5 ? 'Descripción Extendida' : 'Resultados';
      this.notificationService.warning(
        `Advertencia: El campo de ${fieldName} supera los 5MB. Esto podría ralentizar la carga de la página.`
      );
    }

    const formData = new FormData();
    const values = this.form.value;

    Object.keys(values).forEach((key) => {
      if (values[key] !== null && values[key] !== undefined) {
        if (key === 'investigadores' || key === 'lineas' || key === 'keywords') {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      }
    });

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.submitForm.emit(formData);
  }

  getControlSizeMb(controlName: string): number {
    const value = this.form?.get(controlName)?.value || '';
    const sizeInBytes = new Blob([value]).size;
    return sizeInBytes / (1024 * 1024);
  }

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
