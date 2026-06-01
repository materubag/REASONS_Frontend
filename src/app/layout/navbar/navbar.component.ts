import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;
  isMobileMenuOpen = false;

  private touchStartX = 0;
  private touchStartY = 0;

  ngOnInit() {
    this.checkTheme();
  }

  isHomeRoute(): boolean {
    return typeof window !== 'undefined' && window.location.pathname === '/';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  private checkTheme() {
    if (typeof window !== 'undefined') {
      this.isDarkMode = document.documentElement.classList.contains('dark');
    }
  }

  toggleDarkMode() {
    if (typeof window !== 'undefined') {
      const active = document.documentElement.classList.toggle('dark');
      this.isDarkMode = active;
      localStorage.setItem('theme', active ? 'dark' : 'light');
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

        if (this.isMobileMenuOpen) {
          // Swipe right (left to right) to close the drawer
          if (diffX > 50) {
            this.closeMobileMenu();
          }
        } else {
          // Swipe left (right to left) starting near the right edge to open the drawer
          const screenWidth = window.innerWidth;
          const startNearRightEdge = (screenWidth - this.touchStartX) < 80;
          if (diffX < -50 && startNearRightEdge) {
            this.toggleMobileMenu();
          }
        }
      }
    }
  }
}
