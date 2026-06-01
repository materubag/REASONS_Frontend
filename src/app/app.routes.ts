import { Routes } from '@angular/router';

// Layouts
import { PublicLayout, AdminLayout } from './layout';
import { authGuard } from './core/guards/auth-guard';

// Public Pages
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { ProyectosPageComponent } from './features/proyectos/pages/proyectos-page/proyectos-page.component';
import { ProyectoDetailPageComponent } from './features/proyectos/pages/proyecto-detail-page/proyecto-detail-page.component';
import { ContactosPageComponent } from './features/contactos/pages/contactos-page/contactos-page.component';
import { PublicacionesPage } from './features/publicaciones/pages/publicaciones-page/publicaciones-page';
import { PublicacionDetailPageComponent } from './features/publicaciones/pages/publicacion-detail-page/publicacion-detail-page.component';
import { InvestigadoresPage } from './features/investigadores/pages/investigadores-page/investigadores-page';

// Auth Pages
import { Login } from './features/auth/login/login';

// Admin Pages
import { InvestigadoresList } from './features/admin/investigadores/pages/investigadores-list/investigadores-list';
import { InvestigadorCreate } from './features/admin/investigadores/pages/investigador-create/investigador-create';
import { InvestigadorEdit } from './features/admin/investigadores/pages/investigador-edit/investigador-edit';

import { ProyectosList } from './features/admin/proyectos/pages/proyectos-list/proyectos-list';
import { ProyectoCreate } from './features/admin/proyectos/pages/proyecto-create/proyecto-create';
import { ProyectoEdit } from './features/admin/proyectos/pages/proyecto-edit/proyecto-edit';

import { PublicacionesList } from './features/admin/publicaciones/pages/publicaciones-list/publicaciones-list';
import { PublicacionCreate } from './features/admin/publicaciones/pages/publicacion-create/publicacion-create';
import { PublicacionEdit } from './features/admin/publicaciones/pages/publicacion-edit/publicacion-edit';

import { ContactosList } from './features/admin/contactos/pages/contactos-list/contactos-list';

import { GrupoInformacionEdit } from './features/admin/grupo-informacion/pages/grupo-informacion-edit/grupo-informacion-edit';
import { LineaInvestigacionList } from './features/admin/grupo-informacion/pages/linea-investigacion-list/linea-investigacion-list';
import { LineaInvestigacionCreate } from './features/admin/grupo-informacion/pages/linea-investigacion-create/linea-investigacion-create';
import { LineaInvestigacionEdit } from './features/admin/grupo-informacion/pages/linea-investigacion-edit/linea-investigacion-edit';
import { pendingChangesGuard } from './core/guards/pending-changes.guard';

export const routes: Routes = [
  // Auth Route
  {
    path: 'login',
    component: Login,
  },

  // Public Layout Routes
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'proyectos',
        component: ProyectosPageComponent,
      },
      {
        path: 'proyectos/:id',
        component: ProyectoDetailPageComponent,
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
        path: 'publicaciones/:id',
        component: PublicacionDetailPageComponent,
      },
      {
        path: 'contactos',
        component: ContactosPageComponent,
      },
    ],
  },

  // Admin Layout Routes
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'investigadores/list',
        pathMatch: 'full',
      },
      
      // Admin Investigadores
      {
        path: 'investigadores',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            component: InvestigadoresList,
          },
          {
            path: 'create',
            component: InvestigadorCreate,
          },
          {
            path: 'edit/:id',
            component: InvestigadorEdit,
          },
        ],
      },

      // Admin Proyectos
      {
        path: 'proyectos',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            component: ProyectosList,
          },
          {
            path: 'create',
            component: ProyectoCreate,
          },
          {
            path: 'edit/:id',
            component: ProyectoEdit,
            canDeactivate: [pendingChangesGuard],
          },
        ],
      },

      // Admin Publicaciones
      {
        path: 'publicaciones',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            component: PublicacionesList,
          },
          {
            path: 'create',
            component: PublicacionCreate,
          },
          {
            path: 'edit/:id',
            component: PublicacionEdit,
            canDeactivate: [pendingChangesGuard],
          },
        ],
      },

      // Admin Contactos
      {
        path: 'contactos',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'list',
            component: ContactosList,
          },
        ],
      },

      // Admin Grupo Información & Líneas de Investigación
      {
        path: 'grupo-informacion',
        children: [
          {
            path: '',
            redirectTo: 'edit',
            pathMatch: 'full',
          },
          {
            path: 'edit',
            component: GrupoInformacionEdit,
          },
          {
            path: 'lineas',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'list',
                component: LineaInvestigacionList,
              },
              {
                path: 'create',
                component: LineaInvestigacionCreate,
              },
              {
                path: 'edit/:id',
                component: LineaInvestigacionEdit,
              },
            ],
          },
        ],
      },
    ],
  },

  // Fallback Wildcard Route
  {
    path: '**',
    redirectTo: '',
  },
];
