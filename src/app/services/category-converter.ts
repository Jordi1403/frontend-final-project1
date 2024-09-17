import {
    QueryDocumentSnapshot,
    SnapshotOptions,
  } from '@angular/fire/firestore';
  import { Category } from '../../shared/model/category';
  import { TranslatedWord } from '../../shared/model/translated-word'; // Adjust the import path if necessary
  
  export const categoryConverter = {
    toFirestore: (categoryToSave: Category) => {
      const wordsArr = categoryToSave.words.map((word) => ({
        origin: word.origin,
        target: word.target,
      }));
  
      return {
        name: categoryToSave.name,
        origin: categoryToSave.origin,
        target: categoryToSave.target,
        lastUpdateDate:
          categoryToSave.lastUpdateDate instanceof Date
            ? categoryToSave.lastUpdateDate
            : new Date(),
        words: wordsArr,
      };
    },
  
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
      const data = snapshot.data(options);
  
      // Debugging Log: Check raw data from Firestore
      console.log('Raw Firestore Data:', data);
  
      // Check if `lastUpdateDate` exists and is a Firestore timestamp, otherwise use a new Date
      const lastUpdateDate =
        data['lastUpdateDate'] && data['lastUpdateDate'].toDate
          ? data['lastUpdateDate'].toDate()
          : new Date();
  
      // Create a new Category object
      const category = new Category(
        snapshot.id,
        data['name'] || '', // Default to empty string if name is missing
        data['origin'] || '', // Default to empty string if origin is missing
        data['target'] || '', // Default to empty string if target is missing
        [], // Words will be populated below
        lastUpdateDate // Converted Firestore Timestamp
      );
  
      // If there are words in the document, map them to TranslatedWord objects
      if (Array.isArray(data['words'])) {
        category.words = data['words'].map((word) => {
          // Debugging Log for each word
          console.log('Mapping word:', word);
          return new TranslatedWord(word.origin || '', word.target || '');
        });
      } else {
        console.warn('No words found or invalid format for words:', data['words']);
      }
  
      return category;
    },
  };
  