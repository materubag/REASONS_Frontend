import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="bg-gradient-to-r from-primary to-primary-dark text-white py-20 md:py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div class="space-y-6">
            <div class="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
              University of Texas at Arlington
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Research in Engineering and Advanced Sustainable Operations, Nature, and Society
            </h1>
            <p class="text-lg text-white/90 max-w-2xl">
              Driving innovative engineering solutions at the intersection of technology, sustainability,
              and society. We leverage advanced materials, data science, and sustainable practices to build
              a resilient future.
            </p>
            <div class="flex gap-4 pt-6">
              <button
                routerLink="/proyectos"
                class="bg-white text-primary px-8 py-3 rounded font-semibold hover:bg-gray-100 transition"
              >
                Explorar Proyectos
              </button>
              <button
                routerLink="/contactos"
                class="border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white/10 transition"
              >
                Contactanos
              </button>
            </div>
          </div>

          <!-- Image -->
          <div class="hidden md:block">
            <img
              src="assets/images/hero-image.jpg"
              alt="REASONS Lab"
              class="rounded-lg shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HeroComponent {}
