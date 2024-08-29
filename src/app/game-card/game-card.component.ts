import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GameProfile } from '../../shared/model/GameProfile';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [
    CommonModule,MatCardModule
  ],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  @Input()
currentGame?: GameProfile;
}

