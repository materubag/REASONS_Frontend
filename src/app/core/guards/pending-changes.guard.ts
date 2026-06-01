import { CanDeactivateFn } from '@angular/router';

export interface HasPendingChanges {
  hasUnsavedChanges(): boolean;
}

export const pendingChangesGuard: CanDeactivateFn<HasPendingChanges> = (component) => {
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    if (typeof window !== 'undefined') {
      return confirm('Tiene cambios sin guardar en el formulario. ¿Está seguro de que desea salir?');
    }
  }
  return true;
};
