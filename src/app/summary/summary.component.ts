import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
})
export class SummaryComponent implements OnInit {
  finalScore: number = 0;
  wordsUsed: {
    origin: string;
    target: string;
    correct: boolean;
    userAnswer: string;
  }[] = [];
  categoryId: string = '';  // Updated to be a string
  gameType: string = '';

  constructor(
    private router: Router,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.finalScore = this.gameStateService.getScore();
    this.wordsUsed = this.gameStateService.getWordsUsed();
    this.categoryId = this.gameStateService.getCategoryId(); // Should return a string now
    this.gameType = this.gameStateService.getGameType();

    // Check if there are no words used (navigation issue or state problem)
    if (this.wordsUsed.length === 0) {
      console.error('No words found, possibly a navigation issue.');
    }
  }

  playAgain(): void {
    if (this.categoryId && this.gameType) {
      // Navigate back to the specific game type with the category ID
      this.router.navigate([`/${this.gameType}`, this.categoryId]);
    } else {
      console.error('Missing category ID or game type.');
    }
  }

  chooseAnotherGame(): void {
    // Navigate to the game selection page
    this.router.navigate(['/chose-game']);
  }
}
