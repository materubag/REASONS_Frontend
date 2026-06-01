import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- Toasts Container -->
    <div class="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none max-w-sm w-full">
      <div 
        *ngFor="let toast of ns.toasts"
        [ngClass]="{
          'bg-emerald-50 border-emerald-400 text-emerald-800': toast.type === 'success',
          'bg-rose-50 border-rose-400 text-rose-800': toast.type === 'error',
          'bg-amber-50 border-amber-400 text-amber-800': toast.type === 'warning',
          'bg-blue-50 border-blue-400 text-blue-800': toast.type === 'info'
        }"
        class="pointer-events-auto flex items-start p-4 rounded-lg border shadow-lg transition-all transform duration-300 animate-slide-in"
      >
        <span class="material-symbols-outlined mr-3 text-xl flex-shrink-0 mt-0.5" [ngClass]="{
          'text-emerald-600': toast.type === 'success',
          'text-rose-600': toast.type === 'error',
          'text-amber-600': toast.type === 'warning',
          'text-blue-600': toast.type === 'info'
        }">
          {{ 
            toast.type === 'success' ? 'check_circle' : 
            toast.type === 'error' ? 'error' : 
            toast.type === 'warning' ? 'warning' : 'info' 
          }}
        </span>
        <span class="text-xs font-semibold leading-relaxed">{{ toast.message }}</span>
      </div>
    </div>

    <!-- Beautiful Confirmation Dialog -->
    <div 
      *ngIf="ns.confirmState.show"
      class="fixed inset-0 z-[9998] bg-deep-navy/45 backdrop-blur-[3px] flex items-center justify-center p-4 transition-all duration-300"
      (click)="ns.confirmAction(false)"
    >
      <div 
        class="bg-surface-container-lowest border border-muted-blue-gray/30 rounded-xl p-6 md:p-8 max-w-md w-full shadow-2xl relative transform transition-all duration-300 animate-up scale-100"
        (click)="$event.stopPropagation()"
      >
        <div class="flex flex-col items-center text-center">
          <!-- Icon Circle -->
          <div 
            [ngClass]="{
              'bg-rose-50 text-rose-600 border-rose-200': ns.confirmState.options?.type === 'danger',
              'bg-amber-50 text-amber-600 border-amber-200': ns.confirmState.options?.type === 'warning',
              'bg-blue-50 text-blue-600 border-blue-200': ns.confirmState.options?.type === 'info'
            }"
            class="w-16 h-16 rounded-full border flex items-center justify-center shadow-inner mb-4"
          >
            <span class="material-symbols-outlined text-[32px]">
              {{ 
                ns.confirmState.options?.type === 'danger' ? 'delete_forever' : 
                ns.confirmState.options?.type === 'warning' ? 'warning' : 'help' 
              }}
            </span>
          </div>

          <!-- Dialog Title -->
          <h2 class="text-xl font-bold text-deep-navy mb-2 font-headline-md">
            {{ ns.confirmState.options?.title }}
          </h2>

          <!-- Dialog Message -->
          <p class="text-sm text-slate-gray leading-relaxed mb-8">
            {{ ns.confirmState.options?.message }}
          </p>

          <!-- Action Buttons -->
          <div class="flex items-center justify-center gap-3 w-full">
            <button 
              type="button"
              (click)="ns.confirmAction(false)"
              class="flex-1 inline-flex items-center justify-center px-5 py-3 border border-muted-blue-gray text-deep-navy font-semibold text-xs rounded-lg hover:bg-surface-container-high transition-colors"
            >
              {{ ns.confirmState.options?.cancelText }}
            </button>
            <button 
              type="button"
              (click)="ns.confirmAction(true)"
              [ngClass]="{
                'bg-error hover:bg-error-container text-white': ns.confirmState.options?.type === 'danger',
                'bg-primary hover:bg-surface-tint text-on-primary': ns.confirmState.options?.type !== 'danger'
              }"
              class="flex-1 inline-flex items-center justify-center px-5 py-3 font-semibold text-xs rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              {{ ns.confirmState.options?.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-1rem) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .animate-slide-in {
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class NotificationContainer {
  constructor(public ns: NotificationService) {}
}
