<<<<<<< HEAD

import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AppComponent } from './app/app.component';
import { environment} from './enviroments/enviroment'
 
=======
import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment'

>>>>>>> 8a66ced8e0b908e74afbfc0762fee350fad9af5e
bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // other providers...
  ]
<<<<<<< HEAD

}).catch(err => console.error(err));
 
 
=======
}).catch(err => console.error(err));
>>>>>>> 8a66ced8e0b908e74afbfc0762fee350fad9af5e
