import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-mixed-letters',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mixed-letters.component.html',
  styleUrl: './mixed-letters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixedLettersComponent {
    @Input ()
  id=''
 }
