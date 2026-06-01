import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, NotificationService } from '../../../../../core/services';
import { Contacto } from '../../../../../core/models';
import { ContactoTable } from '../../components/contacto-table/contacto-table';
import { flexibleSearchMatch } from '../../../../../core/utils/search';
import { PaginationComponent } from '../../../../../shared/components';

@Component({
  selector: 'app-contactos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactoTable, PaginationComponent],
  templateUrl: './contactos-list.html',
  styleUrl: './contactos-list.scss',
})
export class ContactosList implements OnInit {
  contactos: Contacto[] = [];
  filteredContactos: Contacto[] = [];
  paginatedContactos: Contacto[] = [];
  loading = true;
  searchTerm = '';
  activeContacto: Contacto | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 20;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadContactos();
  }

  loadContactos(): void {
    this.loading = true;
    this.apiService.getContactos(1, 100).subscribe({
      next: (response) => {
        if (response.success) {
          this.contactos = response.data || [];
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar contactos:', error);
        this.notificationService.error('Error al cargar mensajes del servidor');
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let list = [...this.contactos];

    if (this.searchTerm.trim()) {
      list = list.filter((c) =>
        flexibleSearchMatch([c.nombre, c.correo, c.mensaje, c.asunto], this.searchTerm)
      );
    }

    // Sort by most recent
    this.filteredContactos = list.sort((a, b) => {
      const dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
      const dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
      return dateB - dateA;
    });

    this.currentPage = 1;
    this.updatePaginatedList();
  }

  updatePaginatedList(): void {
    this.paginatedContactos = this.filteredContactos.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedList();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  deleteContacto(id: number): void {
    this.notificationService.confirm({
      title: 'Eliminar Mensaje',
      message: '¿Estás seguro que deseas eliminar este mensaje? Esta acción no se puede deshacer.',
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.deleteContacto(id).subscribe({
          next: (response) => {
            if (response.success) {
              this.notificationService.success('Mensaje de contacto eliminado correctamente');
              this.loadContactos();
              if (this.activeContacto?.id === id) {
                this.closeModal();
              }
            } else {
              this.notificationService.error('No se pudo eliminar el mensaje');
            }
          },
          error: (error) => {
            console.error('Error al eliminar mensaje de contacto:', error);
            this.notificationService.error('Error al conectar con el servidor');
          },
        });
      }
    });
  }

  openModal(contacto: Contacto): void {
    this.activeContacto = contacto;
  }

  closeModal(): void {
    this.activeContacto = null;
  }
}
