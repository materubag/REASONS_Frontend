import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      (click)="onClick()"
      [disabled]="disabled"
      [type]="type"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() onClick = () => {};

  get buttonClasses(): string {
    const baseClasses = 'font-medium rounded transition-colors duration-200 cursor-pointer';

    const variantClasses = {
      primary: 'bg-primary hover:bg-primary-dark text-white disabled:bg-gray-400',
      secondary:
        'border border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-400',
      ghost: 'text-primary hover:bg-primary/10 disabled:text-gray-400',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]}`;
  }
}
