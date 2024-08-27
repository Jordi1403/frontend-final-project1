import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  standalone: true,
  imports: [MatButtonModule],
})
export class SuccessDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { score: number }  // Inject the score data
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
 



