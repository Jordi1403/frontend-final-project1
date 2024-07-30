import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chose-game-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chose-game-dialog.component.html',
  styleUrls: ['./chose-game-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoseGameDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public gameProfile: { name: string },
    private dialogRef: MatDialogRef<ChoseGameDialogComponent>,
    private router: Router
  ) {}

  closeAndNavigate(): void {
    this.dialogRef.close(); // Close the dialog
    this.router.navigate(['/your-route']); // Navigate to the desired route
  }
}
