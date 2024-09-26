import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { Category } from '../../shared/model/category';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chose-game-dialog',
  templateUrl: './chose-game-dialog.component.html',
  styleUrls: ['./chose-game-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class ChoseGameDialogComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory?: Category;

  constructor(
    @Inject(MAT_DIALOG_DATA) public gameProfile: { name: string },  // Injecting the selected game
    private dialogRef: MatDialogRef<ChoseGameDialogComponent>,       // Dialog reference for closing
    private router: Router,                                          // Router for navigation
    private categoriesService: CategoriesService                     // CategoriesService to fetch categories
  ) {}

  async ngOnInit(): Promise<void> {
    // Fetch the categories asynchronously
    try {
      this.categories = await this.categoriesService.list();
      if (this.categories.length === 0) {
        console.error('No categories found');
      } else {
        console.log('Categories fetched:', this.categories); // Debugging log
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  onCategorySelect(category: Category): void {
    this.selectedCategory = category;
    console.log('Selected category:', this.selectedCategory);  // Debugging log
  }

  closeAndNavigate(): void {
    if (!this.selectedCategory || !this.selectedCategory.id) {
      console.error('Invalid or missing category ID:', this.selectedCategory);
      return;
    }

    const gameName = this.gameProfile.name.toLowerCase().replace(/\s+/g, '-');
    let gameRoute = '';

    // Mapping the game names to their routes
    switch (gameName) {
      case 'mixed-letters':
      case 'mixed-words':
        gameRoute = `/mixed-letters/${this.selectedCategory.id}`;
        break;
      case 'trivia':
        gameRoute = `/trivia/${this.selectedCategory.id}`;
        break;
      case 'sort-words':
      case 'sort-word':
        gameRoute = `/sort-words/${this.selectedCategory.id}`;
        break;
      case 'matching-words':
        gameRoute = `/matching-words/${this.selectedCategory.id}`;
        break;
      case 'translation-attack-time':
        gameRoute = `/translation-attack-time/${this.selectedCategory.id}`;
        break;
      default:
        console.error('Unknown game:', gameName);
        return;
    }

    console.log(`Navigating to ${gameRoute} with category ID: ${this.selectedCategory.id}`);
    this.router.navigate([gameRoute]);  // Navigate to the game route
    this.dialogRef.close();  // Close the dialog
  }


  closeDialog(): void {
    this.dialogRef.close();  // Close the dialog without navigating
  }
}
