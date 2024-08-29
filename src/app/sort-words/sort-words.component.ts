import { Component } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { shuffle } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStateService } from '../services/game-state.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { ProgressBarModule } from '../../shared/model/progress-bar';


@Component({
  selector: 'app-sort-words',
  templateUrl: './sort-words.component.html',
  styleUrls: ['./sort-words.component.css'],
  standalone: true,
  imports: [
    CommonModule,   
    MatButtonModule,
    MatProgressBarModule,
    ProgressBarModule, ]
})

export class SortWordsComponent {
  currentCategory?: Category;
  randomCategory?: Category;
  wordsToSort: { origin: string, target: string }[] = [];
  currentWordIndex = 0;
  currentWord: string = '';
  currentCategoryName: string = '';
  gameInitialized = false;
  correctAnswers = 0;
  wordsUsed: { origin: string, target: string, correct: boolean, userAnswer: string }[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private gameStateService: GameStateService
  ) {
    // Initialize the game when the component is created
    this.initializeGame();
  }

  initializeGame(): void {
    const allCategories = this.categoriesService.list();
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentCategory = this.categoriesService.get(categoryId);
    
    if (!this.currentCategory) {
      console.error('No category found or invalid category ID.');
      return;
    }

    this.currentCategoryName = this.currentCategory.name;

    // Select a random category different from the current category
    let randomIndex = Math.floor(Math.random() * allCategories.length);
    this.randomCategory = allCategories[randomIndex];
    while (this.randomCategory?.id === this.currentCategory?.id) {
      randomIndex = Math.floor(Math.random() * allCategories.length);
      this.randomCategory = allCategories[randomIndex];
    }

    // Get 3 random words from the current category
    const currentCategoryWords = this.getRandomWords(this.currentCategory.words, 3);
    
    // Get 3 random words from the random category
    const randomCategoryWords = this.getRandomWords(this.randomCategory?.words || [], 3);

    // Combine and shuffle all words
    this.wordsToSort = shuffle([...currentCategoryWords, ...randomCategoryWords]);

    this.gameInitialized = true;
    this.nextWord();
  }

  getRandomWords(words: { origin: string, target: string }[], count: number): { origin: string, target: string }[] {
    return shuffle(words).slice(0, count);
  }

  nextWord(): void {
    if (this.currentWordIndex < this.wordsToSort.length) {
      this.currentWord = this.wordsToSort[this.currentWordIndex].origin;
    } else {
      // Save the game state before navigating to the summary
      this.gameStateService.setGameState(this.correctAnswers, this.wordsUsed, this.currentCategory?.id || 0, 'sort-words');
this.router.navigate(['/summary']);

    }
  }

  checkAnswer(isYes: boolean): void {
    const isCorrect = isYes === this.currentCategory?.words.some(word => word.origin === this.currentWord);

    const dialogConfig = {
      width: '250px',
      height: '159px'
    };

    this.wordsUsed.push({
      origin: this.currentWord,
      target: this.wordsToSort[this.currentWordIndex].target,
      correct: isCorrect,
      userAnswer: isYes ? 'Yes' : 'No'
    });

    if (isCorrect) {
      this.correctAnswers++;
      this.dialog.open(SuccessDialogComponent, dialogConfig).afterClosed().subscribe(() => {
        this.currentWordIndex++;
        this.nextWord();
      });
    } else {
      this.dialog.open(FailureDialogComponent, dialogConfig).afterClosed().subscribe(() => {
        this.currentWordIndex++;
        this.nextWord();
      });
    }
  }
}
