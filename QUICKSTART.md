# Quick Start Guide - REASONS Frontend

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

Navigate to `http://localhost:4200/`

### 3. Ensure Backend is Running
The backend API should be running on `http://localhost:3000`

```bash
cd ../REASONS_backend
npm run dev
```

---

## 📄 Pages Overview

### **Home Page** (`/`)
- Hero section with project introduction
- Team members carousel
- Strategic objectives (Mission & Vision)

### **Proyectos Page** (`/proyectos`)
- **Projects Section**: Browse research projects with categories
- **Publications Section**: Search and filter scientific publications by year, category, or keywords
- Full pagination support

### **Contactos Page** (`/contactos`)
- Contact form (name, email, subject, message)
- Contact information (address, email, hours)
- Location map
- Form validation and success/error feedback

---

## 🎨 Styling

All colors are defined as CSS variables in `src/styles.scss`:

```scss
/* Primary Colors */
--color-primary: #1e7e34;           // Green
--color-secondary: #6b7280;         // Gray
--color-accent: #3b82f6;            // Blue
```

### Using Tailwind Classes
```html
<!-- Text color -->
<p class="text-primary">Green text</p>

<!-- Background -->
<div class="bg-primary text-white">Content</div>

<!-- Spacing -->
<div class="px-4 py-2">Padded content</div>
```

---

## 🔌 API Integration

### Authentication (Future)
Interceptors are ready in `src/app/core/interceptors/`

### Adding New API Endpoints
1. Add interface to `src/app/core/models/index.ts`
2. Add method to `src/app/core/services/api.service.ts`
3. Use in component:

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

---

## 📦 Creating New Components

### Shared Component (Reusable)
```bash
# Location: src/app/shared/components/my-component/
ng generate component shared/components/my-component --standalone
```

### Feature Component
```bash
# Location: src/app/features/my-feature/components/my-component/
ng generate component features/my-feature/components/my-component --standalone
```

---

## 🧪 Building & Deployment

### Build for Production
```bash
npm run build
```

Output: `dist/reasons-web/`

### Serve Production Build
```bash
npm run serve:ssr:reasons-web
```

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
npx kill-port 4200
```

### Tailwind Styles Not Loading
```bash
# Rebuild Tailwind
npx tailwindcss -i ./src/styles.scss -o ./src/styles.css
```

### API Connection Issues
- Check backend is running: `http://localhost:3000`
- Verify API_URL in `src/app/core/services/api.service.ts`
- Check browser console for CORS errors

---

## 📚 Resources

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [RxJS Guide](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 💡 Tips

- Use the Angular DevTools browser extension for debugging
- Check `src/styles.scss` for available CSS classes and variables
- Components are standalone - import what you need
- Use the `LoadingComponent` for async operations
- Always use Reactive Forms for complex forms

---

## ✅ Checklist Before Deployment

- [ ] Backend API is running and accessible
- [ ] All environment variables are set
- [ ] Tested on mobile devices
- [ ] All links are working
- [ ] Images are loading correctly
- [ ] Forms are validated
- [ ] Error handling is in place
- [ ] Loading states are visible
