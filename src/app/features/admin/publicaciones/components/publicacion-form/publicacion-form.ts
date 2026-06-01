import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Publicacion, Investigador, LineaInvestigacion } from '../../../../../core/models';
import { ApiService } from '../../../../../core/services/api.service';
import { resolveBackendUrl } from '../../../../../core/utils/url';

@Component({
  selector: 'app-publicacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './publicacion-form.html',
  styleUrl: './publicacion-form.scss',
})
export class PublicacionForm implements OnInit {
  @Input() publicacion?: Publicacion;
  @Input() isSubmitting = false;
  @Output() submitForm = new EventEmitter<FormData>();

  form!: FormGroup;
  coverPreview: string | null = null;
  selectedFile: File | null = null;
  isDragOver = false;

  investigadoresList: Investigador[] = [];
  lineasList: LineaInvestigacion[] = [];
  keywords: string[] = [];

  readonly defaultCover = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23e9eff0'/><text x='50' y='50' font-size='40' fill='%238494A4' text-anchor='middle' dy='.3em'>📖</text></svg>";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadResearchersAndLines();
    if (this.publicacion) {
      this.populateForm(this.publicacion);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      autores: ['', [Validators.required, Validators.minLength(5)]],
      resumen: ['', [Validators.required, Validators.minLength(20)]],
      cita: ['', [Validators.required, Validators.minLength(10)]],
      doi: [''],
      url: ['', [Validators.pattern(/https?:\/\/.+/)]],
      keywords: [[]],
      investigadores: [[]],
      lineas: [[]],
    });
  }

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

  private populateForm(pub: Publicacion): void {
    this.keywords = pub.keywords || [];

    this.form.patchValue({
      titulo: pub.titulo,
      autores: pub.autores,
      resumen: pub.resumen,
      cita: pub.cita || '',
      doi: pub.doi || '',
      url: pub.url || '',
      keywords: this.keywords,
      investigadores: pub.investigadores ? pub.investigadores.map(i => i.id) : [],
      lineas: pub.lineas ? pub.lineas.map(l => l.id) : [],
    });

    if (pub.portada) {
      this.coverPreview = this.resolveBackendUrl(pub.portada);
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
      alert('Por favor selecciona una imagen de portada válida');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('La imagen de portada no debe superar 15MB');
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.coverPreview = e.target?.result as string;
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
        if (key === 'investigadores' || key === 'lineas' || key === 'keywords') {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      }
    });

    if (this.selectedFile) {
      formData.append('portada', this.selectedFile);
    }

    this.submitForm.emit(formData);
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

  resolveBackendUrl(path?: string | null): string {
    return resolveBackendUrl(path);
  }
}
