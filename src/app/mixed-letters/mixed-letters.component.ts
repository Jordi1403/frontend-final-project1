import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { shuffle } from 'lodash';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { FailureDialogComponent } from '../failure-dialog/failure-dialog.component';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PointsComponent } from '../points/points.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarModule } from '../../shared/model/progress-bar';
import { GameStateService } from '../services/game-state.service';

// Define a type that includes the user's answer
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
    MatIconModule,
    ProgressBarModule,  // Importing the progress bar component
    PointsComponent,
  ],
})
export class MixedLettersComponent implements OnInit {
<<<<<<< HEAD
=======
  resetInput() {
    throw new Error('Method not implemented.');
  }
>>>>>>> f2b2315bdcefeb2b0cd182d0f33254b8add4ffbc
  currentCategory?: Category;
  currentWordIndex = 0;
  scrambledWord = '';
  userAnswer = '';
  score = 0;
  pointsPerWord: number = 0;

  // Updated wordsUsed to include userAnswer
  wordsUsed: WordEntry[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router,
    private dialog: MatDialog,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const categoryId = +params.get('id')!;
      this.currentCategory = this.categoriesService.get(categoryId);
      if (this.currentCategory) {
        this.pointsPerWord = Math.floor(100 / this.currentCategory.words.length);
        this.nextWord();
      } else {
        console.error('Category not found for ID:', categoryId);
      }
    });
  }

  nextWord(): void {
    if (this.currentCategory && this.currentWordIndex < this.currentCategory.words.length) {
      const word = this.currentCategory.words[this.currentWordIndex].origin;
      this.scrambledWord = shuffle(word.split('')).join('');
      this.userAnswer = '';
    } else {
      this.showSummary();
    }
  }

  submitAnswer(): void {
    const correctAnswer = this.userAnswer.toLowerCase() === this.currentCategory?.words[this.currentWordIndex].origin.toLowerCase();
    
    this.wordsUsed.push({
      origin: this.currentCategory?.words[this.currentWordIndex].origin || '',
      target: this.currentCategory?.words[this.currentWordIndex].target || '',
      correct: correctAnswer,
      userAnswer: this.userAnswer
    });
  
    const dialogConfig = {
      width: '280px',  // Set desired width
      height: '200px', // Set desired height
      data: { score: this.score }
    };
  
    if (correctAnswer) {
      this.score += this.pointsPerWord;
      this.dialog.open(SuccessDialogComponent, dialogConfig).afterClosed().subscribe(() => {
        this.currentWordIndex++;
        this.checkIfFinished();
      });
    } else {
      this.dialog.open(FailureDialogComponent, dialogConfig).afterClosed().subscribe(() => {
        this.currentWordIndex++;
        this.checkIfFinished();
      });
    }
  }
  
  checkIfFinished(): void {
    if (this.currentWordIndex >= (this.currentCategory?.words.length || 0)) {
      this.showSummary();
    } else {
      this.nextWord();
    }
  }

  showSummary(): void {
    if (this.currentCategory) {
      this.gameStateService.setGameState(this.score, this.wordsUsed, this.currentCategory.id);  // Added categoryId
      this.router.navigate(['/summary']);
    }
<<<<<<< HEAD
  }

  resetInput(): void {
    this.userAnswer = '';  // Clear the user's answer
    // Optionally, you can reset other states if needed
=======
>>>>>>> f2b2315bdcefeb2b0cd182d0f33254b8add4ffbc
  }

  exitGame(): void {
    this.dialog.open(ExitConfirmationDialogComponent).afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.router.navigate(['/choose-game']);
      }
    });
  }
}
