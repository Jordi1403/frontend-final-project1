import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,  // Include MatIconModule in the imports
  ],
})
export class SummaryComponent implements OnInit {
  finalScore: number = 0;
  wordsUsed: { origin: string; target: string; correct: boolean; userAnswer: string }[] = [];

  constructor(
    private router: Router,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    // Retrieving the game state from the service
    this.finalScore = this.gameStateService.getScore();
    this.wordsUsed = this.gameStateService.getWordsUsed();

    console.log("Final Score received in Summary:", this.finalScore);
    console.log("Words received in Summary:", this.wordsUsed);

    if (this.wordsUsed.length === 0) {
      console.error('No words found, possibly a navigation issue.');
    }
  }

  playAgain(): void {
    this.router.navigate(['/mixed-letters']);
  }

  chooseAnotherGame(): void {
    this.router.navigate(['/choose-game']);
  }
}
