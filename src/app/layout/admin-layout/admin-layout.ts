import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingScreenComponent } from '../../shared/components';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LoadingScreenComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout implements OnInit {
  isSidebarCollapsed = false;
  isLoaded = false;

  private touchStartX = 0;
  private touchStartY = 0;

  ngOnInit() {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.isSidebarCollapsed = true;
    }

    // Fast and criteria-based transition for the admin dashboard (600ms visual check)
    setTimeout(() => {
      this.isLoaded = true;
    }, 600);
  }

  closeSidebarMobile() {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (typeof window !== 'undefined') {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (typeof window !== 'undefined') {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const diffX = touchEndX - this.touchStartX;
      const diffY = touchEndY - this.touchStartY;

      // Check if the swipe is primarily horizontal and meets minimum swipe distance (50px)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) return;

        if (!this.isSidebarCollapsed) {
          // Sidebar is open (overlaying from right): swipe right (left to right) to close it
          if (diffX > 50) {
            this.closeSidebarMobile();
          }
        } else {
          // Sidebar is closed: swipe left (right to left) starting near the right edge to open the drawer
          const screenWidth = window.innerWidth;
          const startNearRightEdge = (screenWidth - this.touchStartX) < 80;
          if (diffX < -50 && startNearRightEdge) {
            this.isSidebarCollapsed = false;
          }
        }
      }
    }
  }

  get currentUser(): any {
    return this.authService.getUser();
  }

  get userInitials(): string {
    const name = this.currentUser?.nombre || this.currentUser?.correo || 'Administrador';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'AD';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  constructor(
    private authService: Auth,
    private notificationService: NotificationService
  ) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.notificationService.confirm({
      title: 'Cerrar Sesión',
      message: '¿Está seguro de que desea cerrar la sesión actual?',
      confirmText: 'Cerrar Sesión',
      cancelText: 'Cancelar',
      type: 'danger'
    }).then((confirmed) => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }
}

