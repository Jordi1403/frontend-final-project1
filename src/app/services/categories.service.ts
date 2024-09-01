import { Injectable } from '@angular/core';
import { Category } from '../../shared/model/category';
import { categories as defaultCategories } from './../../shared/data/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly CATEGORIES_KEY = 'categories';
  private readonly NEXT_ID_KEY = 'nextId';

  constructor() {
    this.initializeCategories();
  }

  private initializeCategories(): void {
    const existingCategories = this.getCategories();
    if (existingCategories.size === 0 && defaultCategories.length > 0) {
      console.log('Initializing categories with default data.');
      defaultCategories.forEach((cat) => this.add(cat));
    }
  }

  private getCategories(): Map<number, Category> {
    try {
      const categoriesString = localStorage.getItem(this.CATEGORIES_KEY);
      return categoriesString
        ? new Map(JSON.parse(categoriesString))
        : new Map();
    } catch (error) {
      console.error('Failed to parse categories from localStorage', error);
      return new Map();
    }
  }

  private setCategories(list: Map<number, Category>): void {
    localStorage.setItem(
      this.CATEGORIES_KEY,
      JSON.stringify(Array.from(list.entries()))
    );
  }

  private getNextId(): number {
    const nextIdString = localStorage.getItem(this.NEXT_ID_KEY);
    return nextIdString ? parseInt(nextIdString, 10) : 1;
  }

  private setNextId(id: number): void {
    localStorage.setItem(this.NEXT_ID_KEY, id.toString());
  }

  list(): Category[] {
    return Array.from(this.getCategories().values());
  }

  get(id: number): Category | undefined {
    const category = this.getCategories().get(id);
    console.log(`Getting category with ID ${id}:`, category);
    return category;
  }

  delete(id: number): void {
    const categoriesMap = this.getCategories();
    if (categoriesMap.delete(id)) {
      this.setCategories(categoriesMap);
    }
  }

  update(category: Category): void {
    const categoriesMap = this.getCategories();
    category.lastUpdateDate = new Date();
    categoriesMap.set(category.id, category);
    this.setCategories(categoriesMap);
  }

  add(category: Category): void {
    const nextId = this.getNextId();
    category.id = nextId;
    category.lastUpdateDate = new Date();
    const categoriesMap = this.getCategories();
    categoriesMap.set(category.id, category);
    this.setCategories(categoriesMap);
    this.setNextId(nextId + 1);
  }
}
