import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
 
@Component({
  selector: 'app-failure-dialog',
  templateUrl: './failure-dialog.component.html',
  standalone: true,
  imports: [MatButtonModule],
})
export class FailureDialogComponent {
  constructor(private dialogRef: MatDialogRef<FailureDialogComponent>) {}
 
  closeDialog(): void {
    this.dialogRef.close();
  }
}
 