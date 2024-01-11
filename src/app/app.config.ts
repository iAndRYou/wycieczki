import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { PreloadingService } from './services/preloading.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withPreloading(PreloadingService)), 
  importProvidersFrom([
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ])]
};
