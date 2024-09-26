import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormsModule } from '@angular/forms';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { GameStateService } from '../services/game-state.service';
import { GameService } from '../services/game.service';
import { GameResult } from '../../shared/model/game-result';
import { ProgressBarModule } from '../../shared/model/progress-bar';

@Component({
  selector: 'app-matching-words',
  templateUrl: './matching-words.component.html',
  styleUrls: ['./matching-words.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    ProgressBarModule,  // Import ProgressBarModule
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchingWordsComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  currentCategory?: Category;
  wordsToMatch: { origin: string; target: string }[] = [];
  currentWordIndex = 0;
  currentWordOrigin = '';  // Word to be displayed to user (origin)
  currentWordTarget = '';  // Correct translation (target)
  userAnswer = '';  // Stores user's input
  showTranslation = false;  // Controls when to show translation
  totalQuestions = 6;
  pointsPerWord = 0;
  score = 0;
  loading = true;  // Loading state
  private routeSub?: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private gameService: GameService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private gameStateService: GameStateService,
    private cdr: ChangeDetectorRef  // To trigger change detection
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.initializeGame();
    } catch (error) {
      this.errorMessage = 'Failed to initialize the game. Please try again.';
      this.loading = false;
      this.cdr.detectChanges();  // Trigger UI update
    }
  }

  async initializeGame(): Promise<void> {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (!categoryId) {
      this.errorMessage = 'No category ID provided.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      this.currentCategory = await this.categoriesService.get(categoryId);
      if (!this.currentCategory) {
        this.errorMessage = 'No category found or invalid category ID.';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      // Select words from the current category
      this.wordsToMatch = this.currentCategory.words.slice(0, this.totalQuestions);  // Limit the number of words
      this.pointsPerWord = Math.floor(100 / this.totalQuestions);
      this.loading = false;  // Stop loading state
      this.cdr.detectChanges();
      this.nextWord();  // Show the first word
    } catch (error) {
      this.errorMessage = 'Error loading category. Please try again.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  nextWord(): void {
    if (this.currentWordIndex < this.wordsToMatch.length) {
      const wordPair = this.wordsToMatch[this.currentWordIndex];
      this.currentWordOrigin = wordPair.origin;  // Show the origin word
      this.currentWordTarget = wordPair.target;  // Store the correct translation
      this.userAnswer = '';  // Reset the input field
      this.showTranslation = false;  // Don't show the translation yet
      this.cdr.detectChanges();  // Update the UI
    } else {
      this.endGame();  // End the game when all words are done
    }
  }

  checkAnswer(): void {
    const correctAnswer = this.currentWordTarget;

    if (this.userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      this.score += this.pointsPerWord;
    }

    this.showTranslation = true;  // Show the correct translation after answer is submitted
    this.cdr.detectChanges();  // Update the UI
  }

  nextQuestion(): void {
    this.currentWordIndex++;
    if (this.currentWordIndex >= this.totalQuestions) {
      this.endGame();
    } else {
      this.nextWord();  // Show the next word
    }
  }

  endGame(): void {
    const gameResult = new GameResult(
      this.currentCategory?.id || '',
      'matching-words', // Game identifier
      new Date(),
      this.score
    );
  
    this.gameService.addGameResult(gameResult)
      .then(() => {
        console.log('Game result saved successfully.');
      })
      .catch(error => {
        console.error('Failed to save game result:', error);
      });
      
    this.gameStateService.setGameState(this.score, [], this.currentCategory?.id || '', 'matching-words');
    this.router.navigate(['/summary']);
  }

  exitGame(): void {
    this.dialog.open(ExitConfirmationDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result === 'yes') {
          this.router.navigate(['/chose-game']);
        }
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
