import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  standalone: true,
  template: `
    <div class="mb-8 md:mb-12">
      <h1 class="section-title">{{ title }}</h1>
      <p class="section-subtitle">{{ subtitle }}</p>
    </div>
  `,
  styles: []
})
export class SectionTitleComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
