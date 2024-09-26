import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  standalone: true,
  imports: [MatButtonModule],
})
export class SuccessDialogComponent {
  constructor(private dialogRef: MatDialogRef<SuccessDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
