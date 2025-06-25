import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "huepfburgen-app", appId: "1:219430064885:web:e78e6bf0341eae866e2bbc", storageBucket: "huepfburgen-app.firebasestorage.app", apiKey: "AIzaSyD7kKQwv-kYD-zKFn6M_N1zfh9HzPMcWYE", authDomain: "huepfburgen-app.firebaseapp.com", messagingSenderId: "219430064885" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
