import { CategoriesService } from './../services/categories.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Language } from '../../shared/model/language';
import { Category } from '../../shared/model/category';
import { FormsModule, NgModelGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslatedWord } from '../../shared/model/translated-word';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit { 
  currentCategory = new Category('', '', Language.English, Language.Hebrew);
  displayedColumns: string[] = ['Origin', 'Target', 'Actions'];

  @Input() id?: string;

  @ViewChild('wordsGroup') wordsGroup?: NgModelGroup;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.id) {
      const categoryData = await this.categoriesService.get(this.id);
      if (categoryData) {
        this.currentCategory = categoryData;
      }
    }
  }

  addWord(): void {
    // Add a new word pair (empty by default) to the list
    this.currentCategory.words.push(new TranslatedWord('', ''));
  }

  deleteWord(index: number): void {
    this.currentCategory.words.splice(index, 1);
    if (this.wordsGroup) {
      this.wordsGroup.control.markAsDirty();
    }
  }

  async saveCategory(): Promise<void> {
    console.log('Saving Category:', this.currentCategory);
    try {
      if (this.id) {
        await this.categoriesService.update(this.currentCategory);
      } else {
        await this.categoriesService.add(this.currentCategory);
      }
      // Redirect the user to the /categories route after saving the category
      this.router.navigate(['/categories']);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }
}