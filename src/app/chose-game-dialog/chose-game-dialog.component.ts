import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class ChoseGameDialogComponent { }
