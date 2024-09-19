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
import { GameService } from '../services/game.service';
import { GameResult } from '../../shared/model/game-result';

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
export class SortWordsComponent implements OnInit {
  errorMessage: string | null = null;
  currentCategory?: Category;
  wordsToSort: { origin: string; target: string; fromCurrentCategory: boolean }[] = [];
  currentWordIndex = 0;
  currentWord: string = '';
  currentCategoryName: string = '';
  gameInitialized = false;
  correctAnswers = 0;
  totalQuestions = 6; // 6 rounds of guessing
  pointsPerWord = 0;
  wordsUsed: {
    origin: string;
    target: string;
    correct: boolean;
    userAnswer: string;
  }[] = [];
  score = 0;
  loading = true; // Added to track loading state

  constructor(
    private categoriesService: CategoriesService,
    private gameService: GameService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private gameStateService: GameStateService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.initializeGame();
    } catch (error) {
      this.errorMessage = 'Failed to initialize the game. Please try again.';
      this.loading = false; // Ensure loading is stopped in case of an error
    }
  }

  async initializeGame(): Promise<void> {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (!categoryId) {
      this.errorMessage = 'No category ID provided.';
      this.loading = false; // Hide progress bar if no category ID is provided
      return;
    }

    // Fetch the current category selected by the user
    this.currentCategory = await this.categoriesService.get(categoryId);
    if (!this.currentCategory) {
      this.errorMessage = 'No category found or invalid category ID.';
      this.loading = false; // Hide progress bar if the category is invalid
      return;
    }

    // Fetch all categories
    const allCategories: Category[] = await this.categoriesService.list();
    this.currentCategoryName = this.currentCategory.name;

    // Get 3 random words from the current category
    const currentCategoryWords = this.getRandomWords(this.currentCategory.words, 3)
      .map(word => ({ ...word, fromCurrentCategory: true }));

    // Get 3 random words from other categories (not the current one)
    const otherCategories = allCategories.filter(cat => cat.id !== this.currentCategory?.id);
    const randomWordsFromOtherCategories = shuffle(
      otherCategories.reduce((acc, category) => {
        const words = this.getRandomWords(category.words, 1);
        return [...acc, ...words];
      }, [] as { origin: string; target: string }[])
    ).slice(0, 3).map(word => ({ ...word, fromCurrentCategory: false }));

    // Shuffle the words and combine them into one array
    this.wordsToSort = shuffle([...currentCategoryWords, ...randomWordsFromOtherCategories]);

    this.pointsPerWord = Math.floor(100 / this.totalQuestions);
    this.gameInitialized = true;
    this.loading = false; // Hide progress bar once the game is initialized
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
      this.currentWord = this.wordsToSort[this.currentWordIndex]?.origin || ''; // Safe check
    } else {
      this.endGame();
    }
  }

  checkAnswer(isYes: boolean): void {
    if (this.wordsToSort[this.currentWordIndex]) {
      // Check if the current word belongs to the selected category
      const wordBelongsToCategory = this.wordsToSort[this.currentWordIndex].fromCurrentCategory;
      const isCorrect = (isYes && wordBelongsToCategory) || (!isYes && !wordBelongsToCategory);

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

    // Create a new GameResult object
    const gameResult = new GameResult(
      this.currentCategory?.id || '',
      'some-game-id', // Replace with actual game ID if available
      new Date(),
      this.score
    );

    // Save the game result using GameService
    this.gameService.addGameResult(gameResult)
      .then(() => {
        console.log('Game result saved successfully.');
      })
      .catch(error => {
        console.error('Failed to save game result:', error);
      });

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
