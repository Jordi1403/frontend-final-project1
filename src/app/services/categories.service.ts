import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, DocumentReference, query, orderBy, getDoc } from '@angular/fire/firestore';
import { Category } from '../../shared/model/category';
import { categoryConverter } from '../services/category-converter';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly CATEGORIES_COLLECTION = 'categories';

  constructor(private firestore: Firestore) {}

  // Helper to convert Category to a plain object
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
      console.log('Fetching categories from Firestore...');
      const categoriesCollection = collection(this.firestore, this.CATEGORIES_COLLECTION).withConverter(categoryConverter);
      const categorySnapshot = await getDocs(categoriesCollection);
      const categories = categorySnapshot.docs.map(doc => doc.data());
      console.log('Fetched categories:', categories); // Log fetched categories
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
  
  

  // Fetch a category by ID
  async get(id: string): Promise<Category | undefined> {
    try {
      const categoryDoc = doc(this.firestore, this.CATEGORIES_COLLECTION, id).withConverter(categoryConverter);
      const categorySnapshot = await getDoc(categoryDoc);
      if (categorySnapshot.exists()) {
        return categorySnapshot.data();
      } else {
        console.error(`Category with ID ${id} not found.`);
        return undefined;
      }
    } catch (error) {
      console.error(`Error getting category with ID ${id}:`, error);
      return undefined;
    }
  }

  // Add a new category with a sequential ID
  async add(category: Category): Promise<DocumentReference<Category>> {
    try {
      const plainCategory = this.convertCategoryToPlainObject(category); // Convert to plain object
      const categoriesCollection = collection(this.firestore, this.CATEGORIES_COLLECTION).withConverter(categoryConverter);
      const response = await addDoc(categoriesCollection, plainCategory);
      console.log('Category saved successfully:', response); // Log the Firestore response
      return response;
    } catch (error) {
      console.error('Error adding category:', error);
      throw new Error('Failed to add category');
    }
  }
  

  // Update an existing category
  async update(category: Category): Promise<void> {
    try {
      const categoryDoc = doc(this.firestore, this.CATEGORIES_COLLECTION, category.id).withConverter(categoryConverter);
      await updateDoc(categoryDoc, this.convertCategoryToPlainObject(category));
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  // Delete a category
  async delete(id: string): Promise<void> {
    try {
      const categoryDoc = doc(this.firestore, this.CATEGORIES_COLLECTION, id).withConverter(categoryConverter);
      await deleteDoc(categoryDoc);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
}
