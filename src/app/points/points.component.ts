import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './points.component.html',
  styleUrl: './points.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsComponent { }
