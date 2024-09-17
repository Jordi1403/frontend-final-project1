import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { shuffle as lodashShuffle } from 'lodash';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { GameStateService } from '../services/game-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarModule } from '../../shared/model/progress-bar';
import { PointsComponent } from '../points/points.component';

interface WordEntry {
  origin: string;
  target: string;
  correct: boolean;
  userAnswer: string;
}

function shuffleArray<T>(array: T[] | undefined): T[] {
  if (!array || array.length === 0) {
    console.error('The array provided to shuffleArray is either undefined or empty.');
    return [];
  }
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
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
    MatIconModule,
    ProgressBarModule,
    PointsComponent,
  ],
})
export class MixedLettersComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog,
    private gameStateService: GameStateService
  ) {}

  async ngOnInit(): Promise<void> {
    const categoryId = this.route.snapshot.paramMap.get('id') || '';
    if (categoryId) {
      this.currentCategory = await this.categoriesService.get(categoryId);
      if (this.currentCategory && this.currentCategory.words.length > 0) {
        this.currentCategory.words = shuffleArray(this.currentCategory.words);
        this.totalQuestions = this.currentCategory.words.length;
        this.pointsPerWord = Math.floor(100 / this.totalQuestions);
        this.nextWord();
      } else {
        console.error('Category or words not found for ID:', categoryId);
      }
    } else {
      console.error('Invalid category ID:', categoryId);
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
      const correctAnswer =
        this.userAnswer.toLowerCase() === this.currentCategory.words[this.currentWordIndex].origin.toLowerCase();

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

      const dialogConfig = {
        width: '280px',
        height: '200px',
        data: { score: this.score },
      };

      const dialogRef = correctAnswer
        ? this.dialog.open(SuccessDialogComponent, dialogConfig)
        : this.dialog.open(FailureDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(() => {
        this.currentWordIndex++;
        this.checkIfFinished();
      });
    }
  }

  checkIfFinished(): void {
    if (this.currentWordIndex >= this.totalQuestions) {
      this.showSummary();
    } else {
      this.nextWord();
    }
  }

  async showSummary(): Promise<void> {
    if (this.currentCategory) {
      this.score =
        this.correctAnswersCount === this.totalQuestions ? 100 : Math.floor(this.score);
      this.gameStateService.setGameState(
        this.score,
        this.wordsUsed,
        this.currentCategory.id,
        'mixed-letters'
      );
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
