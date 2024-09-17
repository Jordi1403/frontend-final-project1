import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, DocumentReference } from '@angular/fire/firestore';
import { Category } from '../../shared/model/category';
import { categoryConverter } from '../services/category-converter';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly CATEGORIES_COLLECTION = 'categories';

  constructor(private firestore: Firestore) {}

  // Fetch all categories from Firestore
  async list(): Promise<Category[]> {
    try {
      console.log('Fetching categories from Firestore...');
      const categoriesCollection = collection(this.firestore, this.CATEGORIES_COLLECTION).withConverter(categoryConverter);
      const categorySnapshot = await getDocs(categoriesCollection);
      const categories = categorySnapshot.docs.map((doc) => doc.data());

      // Log fetched categories
      console.log('Fetched categories:', categories);
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
        const category = categorySnapshot.data();
        console.log('Fetched category by ID:', category);
        return category;
      } else {
        console.error(`Category with ID ${id} not found.`);
        return undefined;
      }
    } catch (error) {
      console.error(`Error getting category with ID ${id}:`, error);
      return undefined;
    }
  }

  // Add a new category to Firestore
  async add(category: Category): Promise<DocumentReference<Category>> {
    try {
      console.log('Adding category:', category);
      const categoriesCollection = collection(this.firestore, this.CATEGORIES_COLLECTION).withConverter(categoryConverter);
      return await addDoc(categoriesCollection, category);
    } catch (error) {
      console.error('Error adding category:', error);
      throw new Error('Failed to add category');
    }
  }

  // Update an existing category in Firestore
  async update(category: Category): Promise<void> {
    try {
      const categoryDoc = doc(this.firestore, this.CATEGORIES_COLLECTION, category.id).withConverter(categoryConverter);
      console.log('Updating category:', category);
      await updateDoc(categoryDoc, category);
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  // Delete a category from Firestore
  async delete(id: string): Promise<void> {
    try {
      const categoryDoc = doc(this.firestore, this.CATEGORIES_COLLECTION, id).withConverter(categoryConverter);
      console.log(`Deleting category with ID: ${id}`);
      await deleteDoc(categoryDoc);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }
}
