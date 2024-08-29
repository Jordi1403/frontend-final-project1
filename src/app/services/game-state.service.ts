import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private score: number = 0;
  private categoryId: number = 0;
  private gameType: string = ''; // Stores the current game type (e.g., 'sort-words')
  private wordsUsed: { origin: string; target: string; correct: boolean; userAnswer: string }[] = [];

  setGameState(score: number, words: { origin: string; target: string; correct: boolean; userAnswer: string }[], categoryId: number, gameType: string): void {
    this.score = score;
    this.wordsUsed = words;
    this.categoryId = categoryId;
    this.gameType = gameType;
  }

  getScore(): number {
    return this.score;
  }

  getCategoryId(): number {
    return this.categoryId;
  }

  getGameType(): string {
    return this.gameType;
  }

  getWordsUsed(): { origin: string; target: string; correct: boolean; userAnswer: string }[] {
    return this.wordsUsed;
  }

  clearState(): void {
    this.score = 0;
    this.wordsUsed = [];
    this.categoryId = 0;
    this.gameType = '';
  }
}
