import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashbordComponent { }
