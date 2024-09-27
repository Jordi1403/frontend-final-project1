import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, DocumentReference, getDoc } from '@angular/fire/firestore';
import { Category } from '../../shared/model/category';
import { categoryConverter } from '../services/category-converter';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly CATEGORIES_COLLECTION = 'categories';

  constructor(private firestore: Firestore) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private convertCategoryToPlainObject(category: Category): any {
    return {
      id: category.id,
      name: category.name,
      origin: category.origin,
      target: category.target,
      words: category.words.map(word => ({
        origin: word.origin,
        target: word.target
      }))
    };
  }

  async list(): Promise<Category[]> {
    try {
      const categoriesCollection = collection(this.firestore, this.CATEGORIES_COLLECTION).withConverter(categoryConverter);
      const categorySnapshot = await getDocs(categoriesCollection);
      return categorySnapshot.docs.map(doc => doc.data());
    } catch {
      return [];
    }
  }

  async get(id: string): Promise<Category | undefined> {
    try {
      const categoryDoc = doc(this.firestore, this.CATEGORIES_COLLECTION, id).withConverter(categoryConverter);
      const categorySnapshot = await getDoc(categoryDoc);
      return categorySnapshot.exists() ? categorySnapshot.data() : undefined;
    } catch {
      return undefined;
    }
  }

  async add(category: Category): Promise<DocumentReference<Category>> {
    try {
      const plainCategory = this.convertCategoryToPlainObject(category);
      const categoriesCollection = collection(this.firestore, this.CATEGORIES_COLLECTION).withConverter(categoryConverter);
      return await addDoc(categoriesCollection, plainCategory);
    } catch {
      throw new Error('Failed to add category');
    }
  }

  async update(category: Category): Promise<void> {
    try {
      const categoryDoc = doc(this.firestore, this.CATEGORIES_COLLECTION, category.id).withConverter(categoryConverter);
      await updateDoc(categoryDoc, this.convertCategoryToPlainObject(category));
    } catch {
      throw new Error('Failed to update category');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const categoryDoc = doc(this.firestore, this.CATEGORIES_COLLECTION, id).withConverter(categoryConverter);
      await deleteDoc(categoryDoc);
    } catch {
      throw new Error('Failed to delete category');
    }
  }
}
