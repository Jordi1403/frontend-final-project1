import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  private score: number = 0;
  private categoryId: string = '';
  private gameType: string = '';
  private wordsUsed: {
    origin: string;
    target: string;
    correct: boolean;
    userAnswer: string;
  }[] = [];

  // Method to set the game state
  setGameState(
    score: number,
    words: {
      origin: string;
      target: string;
      correct: boolean;
      userAnswer: string;
    }[],
    categoryId: string,
    gameType: string
  ): void {
    this.score = score;
    this.wordsUsed = words;
    this.categoryId = categoryId;
    this.gameType = gameType;
  }

  // Method to get the current score
  getScore(): number {
    return this.score;
  }

  // Method to get the current category ID
  getCategoryId(): string {
    return this.categoryId;
  }

  // Method to get the current game type
  getGameType(): string {
    return this.gameType;
  }

  // Method to get the words used in the game
  getWordsUsed(): {
    origin: string;
    target: string;
    correct: boolean;
    userAnswer: string;
  }[] {
    return this.wordsUsed;
  }

  // Method to clear the game state
  clearState(): void {
    this.score = 0;
    this.wordsUsed = [];
    this.categoryId = '';
    this.gameType = '';
  }
}
