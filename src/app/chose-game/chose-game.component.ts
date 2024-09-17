import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameProfile } from '../../shared/model/GameProfile';
import { GameinfoService } from '../services/gameinfo.service';
import { GameCardComponent } from '../game-card/game-card.component';
import { ChoseGameDialogComponent } from './../chose-game-dialog/chose-game-dialog.component';

@Component({
  selector: 'app-chose-game',
  standalone: true,
  templateUrl: './chose-game.component.html',
  styleUrls: ['./chose-game.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GameCardComponent,
  ]
})
export class ChoseGameComponent implements OnInit {
  allGames: GameProfile[] = [];
  selectedGame: GameProfile | undefined;

  constructor(
    private gameService: GameinfoService,
    private dialogService: MatDialog
  ) {}

  ngOnInit(): void {
    this.allGames = this.gameService.list();  // Ensure the service returns the games
    console.log(this.allGames);
  }

  selectGame(game: GameProfile): void {
    this.selectedGame = game;
    this.openDialog();
  }

  openDialog(): void {
    if (this.selectedGame) {
      this.dialogService.open(ChoseGameDialogComponent, {
        data: this.selectedGame,  // Pass the selected game to the dialog
      });
    }
  }
}
