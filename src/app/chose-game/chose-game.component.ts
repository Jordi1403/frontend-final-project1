import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GameinfoService } from '../services/gameinfo.service';
import { GameCardComponent } from "../game-card/game-card.component";
import { GameProfile } from '../../shared/model/GameProfile';

@Component({
    selector: 'app-chose-game',
    standalone: true,
    templateUrl: './chose-game.component.html',
    styleUrl: './chose-game.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule, MatCardModule,
        GameCardComponent
    ]
})
export class ChoseGameComponent  implements OnInit { 

  allGames : GameProfile[] = [];
  constructor(private gameService : GameinfoService) {}
  ngOnInit(): void {
  this.allGames = this.gameService.list();
  }
 }