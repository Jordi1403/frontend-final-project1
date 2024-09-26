import { Injectable } from '@angular/core';
import { GameProfile } from '../../shared/model/GameProfile';

@Injectable({
  providedIn: 'root',
})
export class GameinfoService {
  private allgames = [
    new GameProfile(
      1,
      'sort word',
      'players must fits words into category or not.',
      'sort-words' 
    ),
    new GameProfile(
      2,
      'mixed words',
      'Unscramble letters to form the correct word',
      'mixed-words'
    ),
    new GameProfile(3, 'trivia', 'Fun and challenging questions', 'trivia'),
    new GameProfile(
      4,
      'matching words',
      'Find and match pairs of related words',
      'matching-words'
    ),
  ];

  list(): GameProfile[] {
    return this.allgames;
  }

  constructor() {}
}
