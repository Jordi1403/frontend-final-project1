import { Injectable } from '@angular/core';
import { GameProfile } from '../../shared/model/GameProfile';

@Injectable({
  providedIn: 'root'
})
export class GameinfoService {
  private allgames = [new GameProfile(1, "sort word", "desc", "sort-words")
    , new GameProfile(2, "mixed words", "desc", "mixed-words")
  ]
  list(): GameProfile[] {
    return this.allgames;
  }
  constructor() { }

}
