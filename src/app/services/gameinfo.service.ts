import { Injectable } from '@angular/core';
import { GameProfile } from '../../shared/model/GameProfile';

@Injectable({
  providedIn: 'root',
})
export class GameinfoService {
  private allgames = [
    new GameProfile(1, 'sort word', 'arrange jumbled words into the correct order', 'sort-words'),
    new GameProfile(2, 'mixed words', 'unscramble letters to form the correct word', 'mixed-words'),
    new GameProfile(3, 'trivia', 'fun and challenging questions', 'trivia'),
  ];

  list(): GameProfile[] {
    return this.allgames;
  }

  constructor() {}
}
