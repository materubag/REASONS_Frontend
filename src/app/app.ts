import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificationContainer } from './shared/components';
import { HomeStoreService } from './core/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, NotificationContainer, CommonModule],
  template: `
    <router-outlet></router-outlet>
    <app-notification-container></app-notification-container>

    <!-- Floating Back to Top Button -->
    <button 
      (click)="scrollToTop()" 
      class="fixed bottom-6 right-6 z-50 p-3 bg-primary text-on-primary shadow-lg hover:bg-primary-dark transition-all duration-300 transform flex items-center justify-center cursor-pointer border-0"
      [ngClass]="showBackToTop ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'"
      style="border-radius: 9999px; width: 48px; height: 48px;"
      title="Volver al inicio"
    >
      <span class="material-symbols-outlined text-[24px]">arrow_upward</span>
    </button>
  `,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  showBackToTop = false;

  constructor(private homeStore: HomeStoreService) {}

  ngOnInit() {
    this.initTheme();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.showBackToTop = window.scrollY > 300;
    }
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  private initTheme() {
    if (typeof window !== 'undefined') {
      // 1. Initial dark mode setup from localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // 2. Fetch group info to apply mainColor theme
      this.homeStore.getGrupoInformacion(1, 1).subscribe({
        next: (response) => {
          if (response.success && response.data.length > 0) {
            const mainColor = response.data[0].mainColor;
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
        },
        error: (error) => {
          console.error('Error loading group mainColor theme:', error);
        }
      });
    }
  }
}

