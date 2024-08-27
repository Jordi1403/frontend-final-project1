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
import { ProgressBarComponent } from '../progress-bar/progress-bar.component'; // If standalone
import { ProgressBarModule } from '../../shared/model/progress-bar';
import { MatIconModule } from '@angular/material/icon';
 
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
    ProgressBarModule,  // Import as standalone component
    PointsComponent,],
  })
 
  export class MixedLettersComponent implements OnInit {
resetInput() {
throw new Error('Method not implemented.');
}
    currentCategory?: Category;
    currentWordIndex = 0;
    scrambledWord = '';
    userAnswer = '';
    score = 0;
    maxScore = 0;
    pointsPerWord: number = 0;
 
 
    constructor(
      private route: ActivatedRoute,
      private categoriesService: CategoriesService,
      private router: Router,
      private dialog: MatDialog
    ) {}
 
    ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        const categoryId = +params.get('id')!;
        this.currentCategory = this.categoriesService.get(categoryId);
        if (this.currentCategory) {
          // Calculate points per word
          this.pointsPerWord = Math.floor(this.maxScore / this.currentCategory.words.length);
          this.nextWord();
        } else {
          console.error('Category not found for ID:', categoryId);
        }
      });
    }
 
    nextWord(): void {
      if (this.currentCategory && this.currentWordIndex < this.currentCategory.words.length) {
        const word = this.currentCategory.words[this.currentWordIndex].origin;  // Origin is in English
        this.scrambledWord = shuffle(word.split('')).join('');
        this.userAnswer = '';
      } else {
        this.showSummary();
      }
    }
 
    submitAnswer(): void {
      const correctAnswer = this.userAnswer.toLowerCase() === this.currentCategory?.words[this.currentWordIndex].origin.toLowerCase();
     
      if (correctAnswer) {
        this.score += this.pointsPerWord;
        this.dialog.open(SuccessDialogComponent).afterClosed().subscribe(() => {
          this.currentWordIndex++;
          this.checkIfFinished();
        });
      } else {
        this.dialog.open(FailureDialogComponent).afterClosed().subscribe(() => {
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
      this.router.navigate(['/summary']);
    }
 
    exitGame(): void {
      this.dialog.open(ExitConfirmationDialogComponent).afterClosed().subscribe((result) => {
        if (result === 'yes') {
          this.router.navigate(['/choose-game']);
        }
      });
    }
  }