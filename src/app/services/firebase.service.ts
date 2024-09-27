// Import the functions you need from the Firebase SDK
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';  // Import Firestore type

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
  firestore: Firestore; // Declare Firestore instance

  constructor() {
    // Initialize Firestore
    this.firestore = getFirestore(app);
  }

  // You can add additional methods here to interact with Firestore
  // For example:
  // async addDocument(collectionName: string, data: any): Promise<void> {
  //   const docRef = await addDoc(collection(this.firestore, collectionName), data);
  //   console.log("Document written with ID: ", docRef.id);
  // }
}
