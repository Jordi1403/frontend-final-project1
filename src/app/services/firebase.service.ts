// Import the functions you need from the Firebase SDK
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';  // If you are using Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw3j3YBG8Hg8ozowybewCtmVDa0twnd0M",
  authDomain: "frontend-final-project1.firebaseapp.com",
  projectId: "frontend-final-project1",
  storageBucket: "frontend-final-project1.appspot.com",
  messagingSenderId: "921702784846",
  appId: "1:921702784846:web:d7b94e8e657b30600d481f"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() {
    // Optionally, initialize Firestore
    const firestore = getFirestore(app);
  }
}
