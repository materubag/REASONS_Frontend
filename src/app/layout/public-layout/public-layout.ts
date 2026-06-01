import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { LoadingScreenComponent } from '../../shared/components';
import { HomeStoreService } from '../../core/services';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, LoadingScreenComponent],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout implements OnInit {
  isLoaded = false;

  constructor(private homeStore: HomeStoreService) {}

  ngOnInit() {
    // Wait for the essential configuration data to resolve from backend
    this.homeStore.getGrupoInformacion(1, 1).subscribe({
      next: () => {
        // Fast-forward loader to complete
        this.isLoaded = true;
      },
      error: () => {
        // Safe fallback in case of connection failure
        this.isLoaded = true;
      }
    });
  }
}

