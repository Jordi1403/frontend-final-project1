import {
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@angular/fire/firestore';
import { Category } from '../../shared/model/category';
import { TranslatedWord } from '../../shared/model/translated-word';

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

  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    const lastUpdateDate =
      data['lastUpdateDate'] && data['lastUpdateDate'].toDate
        ? data['lastUpdateDate'].toDate()
        : new Date();

    const category = new Category(
      snapshot.id,
      data['name'] || '',
      data['origin'] || '',
      data['target'] || '',
      [],
      lastUpdateDate
    );

    if (Array.isArray(data['words'])) {
      category.words = data['words'].map((word) => {
        console.log('Mapping word:', word);
        return new TranslatedWord(word.origin || '', word.target || '');
      });
    } else {
      console.warn(
        'No words found or invalid format for words:',
        data['words']
      );
    }

    return category;
  },
};
