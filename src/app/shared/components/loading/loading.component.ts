import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-12">
      <div class="inline-block">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </div>
  `,
  styles: []
})
export class LoadingComponent {}
