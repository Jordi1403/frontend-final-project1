import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-trivia',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './Trivia.component.html',
  styleUrl: './Trivia.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriviaComponent { 
  @Input()
  id=''
}

