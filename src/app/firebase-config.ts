import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDw3j3YBG8Hg8ozowybewCtmVDa0twnd0M',
  authDomain: 'frontend-final-project1.firebaseapp.com',
  projectId: 'frontend-final-project1',
  storageBucket: 'frontend-final-project1.appspot.com',
  messagingSenderId: '921702784846',
  appId: '1:921702784846:web:d7b94e8e657b30600d481f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it for use in your services
export const firestore = getFirestore(app);
