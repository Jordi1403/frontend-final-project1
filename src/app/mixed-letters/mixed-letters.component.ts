import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { shuffle as lodashShuffle } from 'lodash';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { GameStateService } from '../services/game-state.service';
import { Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WordEntry {
  origin: string;
  target: string;
  correct: boolean;
  userAnswer: string;
}

@Component({
  selector: 'app-mixed-letters',
  templateUrl: './mixed-letters.component.html',
  styleUrls: ['./mixed-letters.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule, // Icons
    SuccessDialogComponent,
    FailureDialogComponent,
    ExitConfirmationDialogComponent,
  ],
})
export class MixedLettersComponent implements OnInit, OnDestroy {
  currentCategory: Category | undefined;
  currentWordIndex = 0;
  scrambledWord = '';
  userAnswer = '';
  score = 0;
  pointsPerWord = 0;
  wordsUsed: WordEntry[] = [];
  errorMessage = '';
  totalQuestions = 0;
  correctAnswersCount = 0;
  categorySubscription: Subscription | undefined;
  loading = true; // For loading progress bar
  insufficientWords = false; // Check if the category has enough words

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog,
    private gameStateService: GameStateService
  ) {}

  async ngOnInit(): Promise<void> {
    this.resetGameState();

    const categoryId = this.route.snapshot.paramMap.get('id') || '';
    if (categoryId) {
      await this.loadCategory(categoryId);
    } else {
      console.error('Invalid category ID');
    }
  }

  ngOnDestroy(): void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

  resetGameState(): void {
    this.currentWordIndex = 0;
    this.scrambledWord = '';
    this.userAnswer = '';
    this.score = 0;
    this.pointsPerWord = 0;
    this.wordsUsed = [];
    this.errorMessage = '';
    this.totalQuestions = 0;
    this.correctAnswersCount = 0;
    this.loading = true;
    this.insufficientWords = false;
  }

  async loadCategory(categoryId: string): Promise<void> {
    try {
      this.currentCategory = await this.categoriesService.get(categoryId);
      console.log('Fetched category:', this.currentCategory); // Debug log

      if (this.currentCategory && this.currentCategory.words.length >= 6) {
        this.currentCategory.words = lodashShuffle(this.currentCategory.words).slice(0, 6); // Limit to 6 rounds
        this.totalQuestions = this.currentCategory.words.length;
        this.pointsPerWord = Math.floor(100 / this.totalQuestions);
        this.loading = false;
        this.nextWord();
      } else if (this.currentCategory && this.currentCategory.words.length < 6) {
        console.warn('Category has fewer than 6 words. Showing insufficient words warning.');
        this.insufficientWords = true;
        this.loading = false;
      } else {
        console.error('Invalid category or no words found in the category.');
        this.loading = false;
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      this.loading = false;
    }
  }

  nextWord(): void {
    if (this.currentCategory && this.currentWordIndex < this.currentCategory.words.length) {
      const word = this.currentCategory.words[this.currentWordIndex].origin;
      let scrambledWord = this.shuffleWord(word);

      while (scrambledWord === word) {
        scrambledWord = this.shuffleWord(word);
      }

      this.scrambledWord = scrambledWord;
      this.userAnswer = '';
      this.errorMessage = '';
    } else {
      this.showSummary();
    }
  }

  shuffleWord(word: string): string {
    return lodashShuffle(word.split('')).join('');
  }

  submitAnswer(): void {
    if (!this.userAnswer.trim()) {
      this.errorMessage = 'Please enter an answer before submitting.';
      return;
    }

    if (this.currentCategory) {
      const correctAnswer = this.userAnswer.toLowerCase() === this.currentCategory.words[this.currentWordIndex].origin.toLowerCase();

      // Push the current word and answer to wordsUsed
      this.wordsUsed.push({
        origin: this.currentCategory.words[this.currentWordIndex].origin,
        target: this.currentCategory.words[this.currentWordIndex].target,
        correct: correctAnswer,
        userAnswer: this.userAnswer,
      });

      if (correctAnswer) {
        this.correctAnswersCount++;
        this.score += this.pointsPerWord;
      }

      const dialogConfig = { width: '300px', data: { score: this.score } };
      if (correctAnswer) {
        this.dialog.open(SuccessDialogComponent, dialogConfig);
      } else {
        this.dialog.open(FailureDialogComponent, dialogConfig);
      }

      this.currentWordIndex++;
      this.checkIfFinished();
    }
  }

  checkIfFinished(): void {
    if (this.currentWordIndex >= this.totalQuestions) {
      this.showSummary();
    } else {
      this.nextWord();
    }
  }

  showSummary(): void {
    if (this.currentCategory) {
      this.score = this.correctAnswersCount === this.totalQuestions ? 100 : Math.floor(this.score);
      this.gameStateService.setGameState(this.score, this.wordsUsed, this.currentCategory.id, 'mixed-letters');
      this.router.navigate(['/summary']);
    }
  }

  resetInput(): void {
    this.userAnswer = '';
    this.errorMessage = '';
  }

  exitGame(): void {
    this.dialog
      .open(ExitConfirmationDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result === 'yes') {
          this.router.navigate(['/chose-game']);
        }
      });
  }
}
