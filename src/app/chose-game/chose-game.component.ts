import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chose-game',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './chose-game.component.html',
  styleUrl: './chose-game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoseGameComponent { }
