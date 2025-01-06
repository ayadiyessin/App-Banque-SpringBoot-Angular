import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app-routing.module'; // Utilisez `app-routing.module.ts` si vous n'avez pas `app.routes.ts`
import { authInterceptor } from '../Interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // Ajout de l'intercepteur fonctionnel
  ],
};
