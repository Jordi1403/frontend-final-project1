import { ChoseGameDialogComponent } from './../chose-game-dialog/chose-game-dialog.component';
import { GameinfoService } from './../services/gameinfo.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GameCardComponent } from "../game-card/game-card.component";
import { GameProfile } from '../../shared/model/GameProfile';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel binding
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule for form fields
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule for mat-select

@Component({
  selector: 'app-chose-game',
  standalone: true,
  templateUrl: './chose-game.component.html',
  styleUrls: ['./chose-game.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    GameCardComponent,
    FormsModule, // Add FormsModule to imports
    MatFormFieldModule, // Add MatFormFieldModule to imports
    MatSelectModule // Add MatSelectModule to imports
  ]
})
export class ChoseGameComponent implements OnInit {
  allGames: GameProfile[] = [];
  selectedGame: GameProfile | undefined;

  constructor(private gameService: GameinfoService, private dialogService: MatDialog) {}

  ngOnInit(): void {
    this.allGames = this.gameService.list();
  }

  selectGame(game: GameProfile) {
    this.selectedGame = game;
  }

  openDialog() {
    if (this.selectedGame) {
      this.dialogService.open(ChoseGameDialogComponent, {
        data: { name: this.selectedGame.name }
      });
    }
  }
}
