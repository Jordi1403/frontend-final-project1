import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
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
import { ExitButtonComponent } from '../exit-button/exit-button.component'; 
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-translation-attack-time',
  templateUrl: './translation-attack-time.component.html',
  styleUrls: ['./translation-attack-time.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ExitButtonComponent
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
  timeLeft: number = 60; // Total game time in seconds
  gameOver: boolean = false;
  progressValue: number = 0;
  wordsUsed: { origin: string; target: string; correct: boolean; userAnswer: string; }[] = [];  
  loading: boolean = true; // Initialize loading property
  errorMessage: string | null = null; // Initialize errorMessage property

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = id;
      this.loadCategory();
    } else {
      console.error('Category ID not found in route parameters.');
      this.router.navigate(['/']);
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
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
          this.errorMessage = 'Category is invalid or has no words.';
          this.router.navigate(['/']);
        }
      })
      .catch((error) => {
        console.error('Error loading category:', error);
        this.errorMessage = 'Error loading category.';
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
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.timeLeft > 0 && !this.gameOver))
      .subscribe(() => {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          this.endGame();
        }
      });
  }

  submitAnswer(): void {
    const currentWord = this.words[this.currentWordIndex];
    const isCorrect = this.userAnswer.trim().toLowerCase() === currentWord.target.trim().toLowerCase();

    this.score += isCorrect ? 1 : 0;
    this.progressValue = ((this.currentWordIndex + 1) / this.words.length) * 100;

    // Save word result
    this.wordsUsed.push({
      origin: currentWord.origin,
      target: currentWord.target,
      correct: isCorrect,
      userAnswer: this.userAnswer,
    });

    // Show dialog for the answer result
    if (isCorrect) {
      this.dialog.open(SuccessDialogComponent, {
        data: { message: 'תשובה נכונה!' },
      });
    } else {
      this.dialog.open(FailureDialogComponent, {
        data: { message: 'תשובה שגויה!' },
      });
    }

    this.userAnswer = '';
    this.currentWordIndex++;

    if (this.currentWordIndex >= this.words.length || this.timeLeft <= 0) {
      this.endGame();
    }
  }

  endGame(): void {
    this.gameOver = true;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    const passThreshold = this.words.length * 0.7;
    const didPass = this.score >= passThreshold;

    // Set the game state before navigating to the summary
    this.gameStateService.setGameState(
      this.score,
      this.wordsUsed,
      this.categoryId,
      'translation-attack-time'
    );

    // Show appropriate dialog
    if (didPass) {
      this.dialog.open(SuccessDialogComponent, {
        data: {
          score: this.score,
          total: this.words.length,
          message: 'כל הכבוד! עברת את המשחק בהצלחה.',
        },
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/summary']);
      });
    } else {
      this.dialog.open(FailureDialogComponent, {
        data: {
          score: this.score,
          total: this.words.length,
          message: 'לצערנו, לא עברת את המשחק. נסה שוב!',
        },
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/summary']);
      });
    }
  }
}
