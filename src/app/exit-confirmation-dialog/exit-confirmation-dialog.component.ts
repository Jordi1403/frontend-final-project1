import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
 
@Component({
  selector: 'app-exit-confirmation-dialog',
  templateUrl: './exit-confirmation-dialog.component.html',
 
})
export class ExitConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ExitConfirmationDialogComponent>,
    private router: Router
  ) {}
 
  confirmExit(): void {
    this.dialogRef.close();
    this.router.navigate(['/chose-game']);  // Redirect to the choose-game page
  }
 
  cancel(): void {
    this.dialogRef.close('no');
  }
}
 