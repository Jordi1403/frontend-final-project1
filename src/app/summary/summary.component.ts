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
  categoryId: string = '';  
  gameType: string = '';

  constructor(
    private router: Router,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.loadGameState();
  }

  private loadGameState(): void {
    this.finalScore = this.gameStateService.getScore();
    this.wordsUsed = this.gameStateService.getWordsUsed();
    this.categoryId = this.gameStateService.getCategoryId();
    this.gameType = this.gameStateService.getGameType();

    // Debugging logs
    console.log('Final Score:', this.finalScore);
    console.log('Words Used:', this.wordsUsed);
    console.log('Category ID:', this.categoryId);
    console.log('Game Type:', this.gameType);

    if (this.wordsUsed.length === 0) {
      console.error('No words found, possibly a navigation issue.');
    }
  }

  playAgain(): void {
    if (this.categoryId && this.gameType) {
      this.router.navigate([`/${this.gameType}`, this.categoryId]);
    } else {
      console.error('Missing category ID or game type.');
    }
  }

  chooseAnotherGame(): void {
    this.router.navigate(['/chose-game']);
  }
}
