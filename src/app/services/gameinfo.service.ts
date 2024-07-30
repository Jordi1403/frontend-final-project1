import { Injectable } from '@angular/core';
import { GameProfile } from '../../shared/model/GameProfile';
import { ChoseGameComponent } from '../chose-game/chose-game.component';

@Injectable({
  providedIn: 'root'
})
export class GameinfoService {
  open(ChoseGameComponent: ChoseGameComponent, arg1: { data: any; }) {
      throw new Error('Method not implemented.');
  }
  private allgames = [new GameProfile(1, "sort word", "desc", "sort-words")
    , new GameProfile(2, "mixed words", "desc", "mixed-words"),
    new GameProfile(3, "trivia", "desc", "trivia",)
  ]
  list(): GameProfile[] {
    return this.allgames;
  }
  constructor() { }

}
