import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { ProyectosPageComponent } from './features/proyectos/pages/proyectos-page/proyectos-page.component';
import { ContactosPageComponent } from './features/contactos/pages/contactos-page/contactos-page.component';
import { PublicacionesPage } from './features/publicaciones/pages/publicaciones-page/publicaciones-page';
import { InvestigadoresPage } from './features/investigadores/pages/investigadores-page/investigadores-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'proyectos',
    component: ProyectosPageComponent,
  },
  {
    path: 'investigadores',
    component: InvestigadoresPage,
  },
  {
    path: 'publicaciones',
    component: PublicacionesPage,
  },
  {
    path: 'contactos',
    component: ContactosPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
