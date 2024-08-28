import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private score: number = 0;

  // Updated wordsUsed to include the userAnswer property
  private wordsUsed: { origin: string; target: string; correct: boolean; userAnswer: string }[] = [];

  // Updated method to accept and store the userAnswer
  setGameState(score: number, words: { origin: string; target: string; correct: boolean; userAnswer: string }[]): void {
    console.log("Setting game state in service: score =", score, "words =", words);
    this.score = score;
    this.wordsUsed = words;
  }

  getScore(): number {
    console.log("Getting score from service:", this.score);
    return this.score;
  }

  // Updated method to return the words including userAnswer
  getWordsUsed(): { origin: string; target: string; correct: boolean; userAnswer: string }[] {
    console.log("Getting words from service:", this.wordsUsed);
    return this.wordsUsed;
  }

  clearState(): void {
    this.score = 0;
    this.wordsUsed = [];
  }
}
