import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-exit-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './exit-confirmation-dialog.component.html',
  styleUrl: './exit-confirmation-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExitConfirmationDialogComponent { }
