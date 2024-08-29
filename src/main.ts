
import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AppComponent } from './app/app.component';
import { environment} from './enviroments/enviroment'
 
bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // other providers...
  ]

}).catch(err => console.error(err));
 
 