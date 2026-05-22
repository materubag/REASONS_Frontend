# REASONS Frontend - Architecture Overview

## Structure Organization

This Angular application follows a modular, scalable architecture that separates concerns and promotes code reusability. Here's why each folder exists:

### 📦 **core/** - Global Shared Logic
- **Purpose**: Contains singleton services and global utilities
- **Services**: API communication, authentication, state management
- **Interceptors**: HTTP request/response handling
- **Models**: TypeScript interfaces and types
- **Why separate?**: Ensures single instances across the app, avoids duplication

### 🎨 **shared/** - Reusable Components
- **Purpose**: Components used across multiple features
- **Components**: Button, Card, Loading, SectionTitle
- **Utilities**: Pipes, directives, constants
- **Why separate?**: Promotes DRY (Don't Repeat Yourself), easier maintenance

### 🏗️ **layout/** - Navigation & Structure
- **Purpose**: App-wide layout components
- **Navbar**: Navigation menu
- **Footer**: Footer with metadata
- **Why separate?**: Isolated UI structure, easy to modify across the app

### 🎯 **features/** - Feature Modules
- **Purpose**: Page-specific components and logic
- **home/**: Home page (Hero + Team)
- **proyectos/**: Projects & Publications
- **contactos/**: Contact form
- **Why separate?**: Lazy loading, feature isolation, scalability

---

## Technology Stack

- **Framework**: Angular 21.2
- **Styling**: Tailwind CSS + SCSS
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router (standalone components)
- **Forms**: Angular Reactive Forms

---

## Running the Application

### Prerequisites
- Node.js (v18+)
- npm (v11+)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The app will run on `http://localhost:4200`

---

## API Connection

The frontend connects to the backend API running on `http://localhost:3000/api`

### Key Endpoints Used:
- `GET /api/investigadores` - Get researchers
- `GET /api/proyectos` - Get projects
- `GET /api/publicaciones` - Get publications
- `POST /api/contactos` - Submit contact form
- `GET /api/grupo-informacion` - Get group info

---

## Styling Guide

### Color Variables (Global)
Defined in `src/styles.scss`:
```scss
--color-primary: #1e7e34 (Green)
--color-secondary: #6b7280 (Gray)
--color-accent: #3b82f6 (Blue)
--color-danger: #dc2626 (Red)
```

### Component Classes
```scss
.btn-primary      // Green button
.btn-secondary    // Outlined button
.section-title    // Large heading
.card             // Reusable card component
```

---

## Key Features

### ✅ Responsive Design
- Mobile-first approach using Tailwind breakpoints
- Tested on mobile, tablet, and desktop

### ✅ Pagination
- Projects and publications support pagination
- 9 items per page

### ✅ Search & Filter
- Publications can be filtered by title, author, or keywords

### ✅ Error Handling
- HTTP interceptors for error management
- User-friendly error messages

### ✅ Loading States
- Loading spinner component
- Prevents user interaction during data fetch

---

## File Structure Example

```
src/app/
├── core/
│   ├── models/index.ts          # Interfaces & types
│   ├── services/
│   │   └── api.service.ts       # API calls
│   └── interceptors/
├── shared/
│   └── components/
│       ├── button/
│       ├── card/
│       ├── loading/
│       └── section-title/
├── layout/
│   ├── navbar/
│   └── footer/
├── features/
│   ├── home/
│   │   ├── pages/
│   │   │   └── home-page/
│   │   └── components/
│   │       ├── hero/
│   │       └── equipo/
│   ├── proyectos/
│   │   ├── pages/
│   │   │   └── proyectos-page/
│   │   └── components/
│   │       ├── proyecto-card/
│   │       └── publicacion-card/
│   └── contactos/
│       ├── pages/
│       │   └── contactos-page/
│       └── components/
│           └── contacto-form/
├── app.routes.ts                # App routing
├── app.config.ts                # App configuration
└── app.ts                        # Root component
```

---

## Development Best Practices

### Component Creation
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  template: `<div>Content</div>`,
})
export class MyComponent {}
```

### Service Usage
```typescript
constructor(private apiService: ApiService) {}

ngOnInit(): void {
  this.apiService.getProyectos(1, 10).subscribe({
    next: (response) => {
      this.proyectos = response.data;
    },
    error: (error) => console.error(error),
  });
}
```

### Form Handling
Use Reactive Forms with FormBuilder for type safety and validation.

---

## Environment Configuration

Update the API URL in `src/app/core/services/api.service.ts`:
```typescript
private readonly API_URL = 'http://localhost:3000/api';
```

---

## Deployment

Build for production:
```bash
ng build --configuration production
```

Output is in `dist/reasons-web/`

---

## Support

For issues or questions, contact the REASONS research group or refer to the Angular documentation at https://angular.dev
