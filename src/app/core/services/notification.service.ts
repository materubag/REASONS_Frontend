import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  toasts: Toast[] = [];
  private toastIdCounter = 0;

  confirmState: {
    show: boolean;
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
  } = {
    show: false,
    options: null,
    resolve: null,
  };

  /**
   * Show a toast notification
   */
  showToast(message: string, type: Toast['type'] = 'info', duration = 4000): void {
    const id = this.toastIdCounter++;
    const toast: Toast = { id, message, type };
    this.toasts.push(toast);

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    }, duration);
  }

  success(message: string): void {
    this.showToast(message, 'success');
  }

  error(message: string): void {
    this.showToast(message, 'error');
  }

  warning(message: string): void {
    this.showToast(message, 'warning');
  }

  info(message: string): void {
    this.showToast(message, 'info');
  }

  /**
   * Show a beautiful confirmation modal
   */
  confirm(options: ConfirmOptions | string): Promise<boolean> {
    const opts: ConfirmOptions = typeof options === 'string'
      ? { title: 'Confirmar Acción', message: options, confirmText: 'Confirmar', cancelText: 'Cancelar', type: 'warning' }
      : { 
          title: options.title, 
          message: options.message, 
          confirmText: options.confirmText || 'Confirmar', 
          cancelText: options.cancelText || 'Cancelar',
          type: options.type || 'warning'
        };

    return new Promise<boolean>((resolve) => {
      this.confirmState = {
        show: true,
        options: opts,
        resolve: resolve,
      };
    });
  }

  /**
   * Internal helper to resolve and close the confirmation dialog
   */
  confirmAction(value: boolean): void {
    if (this.confirmState.resolve) {
      this.confirmState.resolve(value);
    }
    this.confirmState = {
      show: false,
      options: null,
      resolve: null,
    };
  }
}
