import { EnvironmentProviders, Provider } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp } from '@angular/fire/app';

const TEST_APP_NAME = 'huepfburgen-app-test';

const firebaseTestConfig = {
  projectId: 'huepfburgen-app',
  appId: '1:219430064885:web:e78e6bf0341eae866e2bbc',
  storageBucket: 'huepfburgen-app.firebasestorage.app',
  apiKey: 'AIzaSyD7kKQwv-kYD-zKFn6M_N1zfh9HzPMcWYE',
  authDomain: 'huepfburgen-app.firebaseapp.com',
  messagingSenderId: '219430064885',
};

function getTestFirebaseApp(): FirebaseApp {
  return getApps().some((app) => app.name === TEST_APP_NAME)
    ? getApp(TEST_APP_NAME)
    : initializeApp(firebaseTestConfig, TEST_APP_NAME);
}

export function provideAppTestDependencies(): Array<Provider | EnvironmentProviders> {
  return [
    provideRouter([]),
    provideFirebaseApp(() => getTestFirebaseApp()),
    {
      provide: Auth,
      useValue: {
        currentUser: null,
      },
    },
    provideFirestore(() => getFirestore(getTestFirebaseApp())),
  ];
}
