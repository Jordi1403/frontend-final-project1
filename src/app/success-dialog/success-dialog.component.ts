import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './success-dialog.component.html',
  styleUrl: './success-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessDialogComponent { }
