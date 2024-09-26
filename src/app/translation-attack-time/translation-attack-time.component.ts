import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// ייבוא מודולים נדרשים
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslatedWord } from '../../shared/model/translated-word';
import { GameStateService } from '../services/game-state.service';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { ExitButtonComponent } from '../exit-button/exit-button.component';

@Component({
  selector: 'app-translation-attack-time',
  templateUrl: './translation-attack-time.component.html',
  styleUrls: ['./translation-attack-time.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ExitButtonComponent, // ודא שקומפוננטה זו מיובאת
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
  timeLeft: number = 60; // זמן המשחק בשניות
  totalTime: number = 60; // לזמן התצוגה
  gameOver: boolean = false;
  progressValue: number = 0;
  wordsUsed: {
    origin: string;
    target: string;
    correct: boolean;
    userAnswer: string;
    displayedWord: string; // הוספנו שדה זה אם תרצי להשתמש בו בהצגת התוצאות
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Category ID from route:', id); // לוג לצורך בדיקה
    if (id) {
      this.categoryId = id;
      this.loadCategory();
    } else {
      console.error('Category ID not found in route parameters.');
      this.router.navigate(['/']); // נווט לדף הבית או לנתיב מתאים
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
        console.log('Category from service:', category); // לוג לצורך בדיקה
        if (category && category.words && category.words.length > 0) {
          this.category = category;
          this.words = [...category.words]; // שיכפול מערך המילים
          console.log('Words loaded:', this.words);
          this.currentWordIndex = 0;
          this.shuffleWords();
          this.startTimer();
        } else {
          console.error('Category has no words or is invalid:', category);
          this.router.navigate(['/']); // נווט לדף הבית או לנתיב מתאים
        }
      })
      .catch((error) => {
        console.error('Error loading category:', error);
        this.router.navigate(['/']); // נווט לדף הבית או לנתיב מתאים
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
    const isCorrect =
      this.userAnswer.trim().toLowerCase() ===
      currentWord.origin.trim().toLowerCase();

    this.score += isCorrect ? 1 : 0;
    this.progressValue = ((this.currentWordIndex + 1) / this.words.length) * 100;

    // שמירת תוצאות
    this.wordsUsed.push({
      origin: currentWord.origin,
      target: currentWord.target,
      correct: isCorrect,
      userAnswer: this.userAnswer,
      displayedWord: currentWord.target, // הוספנו שדה זה אם תרצי להשתמש בו בהצגת התוצאות
    });

    this.userAnswer = '';
    this.currentWordIndex++;

    if (this.currentWordIndex >= this.words.length || this.timeLeft <= 0) {
      this.endGame();
    }
  }

  resetGame(): void {
    this.userAnswer = '';
  }

  endGame(): void {
    this.gameOver = true;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    // חישוב הציון הסופי
    const totalQuestions = this.words.length;
    const passThreshold = totalQuestions * 0.7; // 70% נכון כדי לעבור
    const didPass = this.score >= passThreshold;

    if (this.score === totalQuestions) {
      this.score = 100;
    } else {
      this.score = Math.floor((this.score / totalQuestions) * 100);
    }

    // שמירת מצב המשחק
    this.gameStateService.setGameState(
      this.score,
      this.wordsUsed,
      this.category?.id || '',
      'translation-attack-time'
    );

    // נווט לדף הסיכום
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
