import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="visible"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-all duration-500 ease-out"
      [ngClass]="fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'"
    >
      <div 
        class="w-full max-w-[480px] p-12 flex flex-col items-center justify-center gap-10 bg-surface-container border border-border/30 rounded-xl shadow-2xl transition-all duration-300 transform"
        [ngClass]="fadeOut ? 'scale-95' : 'scale-100'"
      >
        <!-- Spinning Gear Logo -->
        <div class="relative w-32 h-32 flex items-center justify-center">
          <img 
            src="/Logo_sin_fondo.png" 
            alt="REASONS logo"
            class="w-32 h-32 object-contain animate-spin-slow"
          />
        </div>

        <!-- Text & Loading Message -->
        <div class="flex flex-col items-center gap-3">
          <p class="font-serif font-bold text-3xl text-deep-navy tracking-tight margin-0">REASONS</p>
          <p class="text-base text-slate-gray h-6 text-center margin-0 select-none">{{ currentMessage }}</p>
        </div>

        <!-- Slim Progress Bar -->
        <div class="w-64 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary rounded-full transition-all duration-200 ease-out"
            [style.width.%]="progress"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .animate-spin-slow {
      animation: spin-gear 4s linear infinite;
      transform-origin: center center;
    }
    @keyframes spin-gear {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .font-serif {
      font-family: 'Source Serif 4', 'Georgia', serif;
    }
    .margin-0 {
      margin: 0;
    }
  `]
})
export class LoadingScreenComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isLoaded = false;

  progress = 0;
  visible = true;
  fadeOut = false;
  currentMessage = 'Cargando datos de investigación…';
  msgIndex = 0;

  private messages = [
    'Cargando datos de investigación…',
    'Conectando con servidores UTA…',
    'Obteniendo publicaciones…',
    'Inicializando líneas de investigación…',
    'Casi listo…'
  ];

  private intervalId: any;

  ngOnInit() {
    this.startSimulation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoaded'] && changes['isLoaded'].currentValue === true) {
      this.completeLoading();
    }
  }

  ngOnDestroy() {
    this.clearInterval();
  }

  private startSimulation() {
    this.clearInterval();
    this.intervalId = setInterval(() => {
      if (this.progress < 85) {
        // Increment progress smoothly
        this.progress += Math.floor(Math.random() * 6) + 3;
        if (this.progress > 85) {
          this.progress = 85;
        }
        this.updateMessage();
      } else {
        this.clearInterval();
      }
    }, 100);
  }

  private updateMessage() {
    const newIndex = Math.min(Math.floor(this.progress / 18), this.messages.length - 1);
    if (newIndex !== this.msgIndex) {
      this.msgIndex = newIndex;
      this.currentMessage = this.messages[this.msgIndex];
    }
  }

  private completeLoading() {
    this.clearInterval();
    
    // Fast-forward to 100% progress
    this.progress = 100;
    this.currentMessage = '¡Listo!';

    // Wait for progress animation to finish, then fade out
    setTimeout(() => {
      this.fadeOut = true;
      // Wait for opacity transition to finish, then hide from DOM
      setTimeout(() => {
        this.visible = false;
      }, 500);
    }, 250);
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
