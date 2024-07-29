import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { GameProfile } from '../../shared/model/GameProfile';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-chose-game-dialog',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './chose-game-dialog.component.html',
  styleUrl: './chose-game-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoseGameDialogComponent {
gameProfile: any; 

  constructor (@Inject(MAT_DIALOG_DATA) public selectedGame : GameProfile) { }
}