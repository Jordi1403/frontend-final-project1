import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private score: number = 0;
  private categoryId: number = 0; // Stores the current category ID
  private wordsUsed: { origin: string; target: string; correct: boolean; userAnswer: string }[] = [];

  setGameState(score: number, words: { origin: string; target: string; correct: boolean; userAnswer: string }[], categoryId: number): void {
    this.score = score;
    this.wordsUsed = words;
    this.categoryId = categoryId;
  }

  getScore(): number {
    return this.score;
  }

  getCategoryId(): number {
    return this.categoryId;
  }

  getWordsUsed(): { origin: string; target: string; correct: boolean; userAnswer: string }[] {
    return this.wordsUsed;
  }

  clearState(): void {
    this.score = 0;
    this.wordsUsed = [];
    this.categoryId = 0;
  }
}
