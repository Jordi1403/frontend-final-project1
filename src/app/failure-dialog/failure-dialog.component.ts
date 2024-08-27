import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-failure-dialog',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './failure-dialog.component.html',
  styleUrl: './failure-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FailureDialogComponent { }
