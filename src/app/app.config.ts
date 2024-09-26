import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp({
        projectId: 'frontend-final-project1',
        appId: '1:921702784846:web:d7b94e8e657b30600d481f',
        storageBucket: 'frontend-final-project1.appspot.com',
        apiKey: 'AIzaSyDw3j3YBG8Hg8ozowybewCtmVDa0twnd0M',
        authDomain: 'frontend-final-project1.firebaseapp.com',
        messagingSenderId: '921702784846',
    })),
    provideFirestore(() => getFirestore()),
    
],
};
