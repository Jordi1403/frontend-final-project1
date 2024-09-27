import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { TranslatedWord } from '../../shared/model/translated-word';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { ExitButtonComponent } from '../exit-button/exit-button.component';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-translation-attack-time',
  templateUrl: './translation-attack-time.component.html',
  styleUrls: ['./translation-attack-time.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ExitButtonComponent,
  ],
})
export class TranslationAttackTimeComponent implements OnInit, OnDestroy {
  categoryId: string = '';
  category: Category | undefined;
  words: TranslatedWord[] = [];
  currentWordIndex: number = 0;
  userAnswer: string = '';
  score: number = 0;
  timerSubscription: Subscription | undefined;
  timeLeft: number = 60;
  gameOver: boolean = false;
  progressValue: number = 0;
  wordsUsed: {
    origin: string;
    target: string;
    correct: boolean;
    userAnswer: string;
  }[] = [];
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';
    if (this.categoryId) {
      this.loadCategory();
    } else {
      console.error('Category ID not found in route parameters.');
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  loadCategory(): void {
    this.categoriesService
      .get(this.categoryId)
      .then((category: Category | undefined) => {
        if (category && category.words && category.words.length > 0) {
          this.category = category;
          this.words = [...category.words];
          this.shuffleWords();
          this.startTimer();
          this.loading = false;
        } else {
          console.error('Category has no words or is invalid:', category);
          this.router.navigate(['/']);
        }
      })
      .catch((error) => {
        console.error('Error loading category:', error);
        this.router.navigate(['/']);
      });
  }

  shuffleWords(): void {
    for (let i = this.words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
    }
  }

  startTimer(): void {
    this.timeLeft = 60;
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0 && !this.gameOver))
      .subscribe(() => {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          this.endGame();
        }
      });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  submitAnswer(): void {
    if (!this.userAnswer.trim()) {
      this.errorMessage = 'Please enter your translation.';
      return;
    }

    if (/[\u0590-\u05FF]/.test(this.userAnswer)) {
      this.errorMessage = 'Please enter the translation in English only.';
      return;
    }

    const currentWord = this.words[this.currentWordIndex];
    const isCorrect =
      this.userAnswer.trim().toLowerCase() ===
      currentWord.origin.trim().toLowerCase();

    this.wordsUsed.push({
      origin: currentWord.origin,
      target: currentWord.target,
      correct: isCorrect,
      userAnswer: this.userAnswer,
    });

    if (isCorrect) {
      this.score++;
      this.dialog.open(SuccessDialogComponent, {
        data: { message: 'Correct answer!' },
      });
    } else {
      this.dialog.open(FailureDialogComponent, {
        data: {
          message: 'Wrong answer! The correct answer is: ' + currentWord.origin,
        },
      });
    }

    this.userAnswer = '';
    this.currentWordIndex++;

    if (this.currentWordIndex >= this.words.length || this.timeLeft <= 0) {
      this.endGame();
    }

    this.errorMessage = null;
  }

  endGame(): void {
    this.gameOver = true;
    this.stopTimer();

    const totalWords = this.words.length;
    const correctAnswers = this.wordsUsed.filter((word) => word.correct).length;
    this.score =
      totalWords > 0 ? Math.round((correctAnswers / totalWords) * 100) : 0;

    this.gameStateService.setGameState(
      this.score,
      this.wordsUsed,
      this.categoryId,
      'translation-attack-time'
    );

    this.router.navigate(['/summary']);
  }

  playAgain(): void {
    this.resetGame();
    this.loadCategory();
  }

  chooseAnotherGame(): void {
    this.router.navigate(['/chose-game']);
    this.gameStateService.clearState();
  }

  onExitClick(): void {
    this.dialog
      .open(ExitConfirmationDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result === 'yes') {
          this.router.navigate(['/chose-game']);
        }
      });
  }

  resetGame(): void {
    this.currentWordIndex = 0;
    this.userAnswer = '';
    this.score = 0;
    this.wordsUsed = [];
    this.shuffleWords();
    this.stopTimer();
    this.startTimer();
    this.errorMessage = null;
  }

  clearErrorMessage(): void {
    this.errorMessage = null;
  }
}
