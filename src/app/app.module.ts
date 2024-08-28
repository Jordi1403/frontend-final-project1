import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

@NgModule({
  declarations: [
    AppComponent,
    // Add your components here
  ],
  imports: [
    BrowserModule,
    // Import Firebase modules
    AngularFireModule.initializeApp(environment.firebase), // Initialize Firebase with config
    AngularFirestoreModule, // Import Firestore module
    AngularFireAuthModule, // Import Auth module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
