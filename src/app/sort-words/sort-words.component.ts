import { Component, OnInit } from '@angular/core';
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
import { ExitButtonComponent } from '../exit-button/exit-button.component';

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
    ExitButtonComponent,
  ],
})
export class SortWordsComponent implements OnInit {
  currentCategory?: Category;
  wordsToSort: {
    origin: string;
    target: string;
    fromCurrentCategory: boolean;
  }[] = [];
  currentWordIndex = 0;
  currentWord: string = '';
  currentCategoryName: string = '';
  gameInitialized = false;
  correctAnswers = 0;
  totalQuestions = 6;
  pointsPerWord = 0;
  wordsUsed: {
    origin: string;
    target: string;
    correct: boolean;
    userAnswer: string;
  }[] = [];
  score = 0;
  errorMessage: string | null = null;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private gameStateService: GameStateService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.initializeGame();
  }

  async initializeGame(): Promise<void> {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (!categoryId) {
      console.error('No category ID provided.');
      return;
    }

    this.currentCategory = await this.categoriesService.get(categoryId);
    if (!this.currentCategory) {
      this.errorMessage = 'No category found or invalid category ID.';
      return;
    }

    const allCategories: Category[] = await this.categoriesService.list();
    this.currentCategoryName = this.currentCategory.name;

    if (this.currentCategory.words.length < 3) {
      this.errorMessage =
        'Not enough words in the selected category. Please choose another category.';
      return;
    }

    const currentCategoryWords = this.getRandomWords(
      this.currentCategory.words,
      3
    ).map((word) => ({ ...word, fromCurrentCategory: true }));

    const otherCategories = allCategories.filter(
      (cat) => cat.id !== this.currentCategory?.id
    );

    const randomWordsFromOtherCategories = shuffle(
      otherCategories.reduce((acc, category) => {
        const words = this.getRandomWords(category.words, 1);
        return [...acc, ...words];
      }, [] as { origin: string; target: string }[])
    )
      .slice(0, 3)
      .map((word) => ({ ...word, fromCurrentCategory: false }));

    if (randomWordsFromOtherCategories.length < 3) {
      this.errorMessage =
        'Not enough words in other categories. Please try again later.';
      return;
    }

    this.wordsToSort = shuffle([
      ...currentCategoryWords,
      ...randomWordsFromOtherCategories,
    ]);

    this.pointsPerWord = Math.floor(100 / this.totalQuestions);
    this.gameInitialized = true;
    this.nextWord();
  }

  getRandomWords(
    words: { origin: string; target: string }[],
    count: number
  ): { origin: string; target: string }[] {
    return shuffle(words).slice(0, count);
  }

  nextWord(): void {
    if (this.currentWordIndex < this.wordsToSort.length) {
      this.currentWord = this.wordsToSort[this.currentWordIndex]?.origin || '';
    } else {
      this.endGame();
    }
  }

  checkAnswer(isYes: boolean): void {
    if (this.wordsToSort[this.currentWordIndex]) {
      const wordBelongsToCategory =
        this.wordsToSort[this.currentWordIndex].fromCurrentCategory;
      const isCorrect =
        (isYes && wordBelongsToCategory) || (!isYes && !wordBelongsToCategory);

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
      this.currentCategory?.id || '',
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
