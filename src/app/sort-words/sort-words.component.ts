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
import { ProgressBarModule } from '../../shared/model/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';

@Component({
  selector: 'app-sort-words',
  templateUrl: './sort-words.component.html',
  styleUrls: ['./sort-words.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    ProgressBarModule,
  ],
})
export class SortWordsComponent {
  currentCategory?: Category;
  randomCategory?: Category;
  wordsToSort: { origin: string; target: string }[] = [];
  currentWordIndex = 0;
  currentWord: string = '';
  currentCategoryName: string = '';
  gameInitialized = false;
  correctAnswers = 0;
  totalQuestions = 0;
  pointsPerWord = 0;
  wordsUsed: {
    origin: string;
    target: string;
    correct: boolean;
    userAnswer: string;
  }[] = [];
  score = 0;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private gameStateService: GameStateService
  ) {
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

    let randomIndex = Math.floor(Math.random() * allCategories.length);
    this.randomCategory = allCategories[randomIndex];
    while (this.randomCategory?.id === this.currentCategory?.id) {
      randomIndex = Math.floor(Math.random() * allCategories.length);
      this.randomCategory = allCategories[randomIndex];
    }

    const currentCategoryWords = this.getRandomWords(
      this.currentCategory.words,
      3
    );

    const randomCategoryWords = this.getRandomWords(
      this.randomCategory?.words || [],
      3
    );

    this.wordsToSort = shuffle([
      ...currentCategoryWords,
      ...randomCategoryWords,
    ]);

    this.pointsPerWord = Math.floor(100 / this.wordsToSort.length);
    this.totalQuestions = this.wordsToSort.length;

    this.gameInitialized = true;
    this.nextWord();
  }

  getRandomWords(
    words: { origin: string; target: string }[],
    count: number
  ): { origin: string; target: string }[] {
    if (words.length < count) {
      return words;
    }
    return shuffle(words).slice(0, count);
  }

  nextWord(): void {
    if (this.currentWordIndex < this.wordsToSort.length) {
      this.currentWord = this.wordsToSort[this.currentWordIndex].origin;
    } else {
      this.endGame();
    }
  }

  checkAnswer(isYes: boolean): void {
    const isCorrect =
      isYes ===
      this.currentCategory?.words.some(
        (word) => word.origin === this.currentWord
      );

    const dialogConfig = {
      width: '250px',
      height: '159px',
    };

    this.wordsUsed.push({
      origin: this.currentWord,
      target: this.wordsToSort[this.currentWordIndex].target,
      correct: isCorrect,
      userAnswer: isYes ? 'Yes' : 'No',
    });

    if (isCorrect) {
      this.score += this.pointsPerWord;
      this.correctAnswers++;
      this.dialog
        .open(SuccessDialogComponent, dialogConfig)
        .afterClosed()
        .subscribe(() => {
          this.currentWordIndex++;
          this.nextWord();
        });
    } else {
      this.dialog
        .open(FailureDialogComponent, dialogConfig)
        .afterClosed()
        .subscribe(() => {
          this.currentWordIndex++;
          this.nextWord();
        });
    }
  }

  endGame(): void {
    if (this.correctAnswers === this.totalQuestions) {
      this.score = 100;
    } else {
      this.score = Math.floor(this.score);
    }

    this.gameStateService.setGameState(
      this.score,
      this.wordsUsed,
      this.currentCategory?.id || 0,
      'sort-words'
    );
    this.router.navigate(['/summary']);
  }

  exitGame(): void {
    this.dialog
      .open(ExitConfirmationDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result === 'yes') {
          this.router.navigate(['/choose-game']);
        }
      });
  }
}
