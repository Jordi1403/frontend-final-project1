import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Angular Material Progress Bar
import { ProgressBarComponent } from '../../app/progress-bar/progress-bar.component';



@NgModule({
  declarations: [ProgressBarComponent],  // Declare ProgressBarComponent
  imports: [CommonModule, MatProgressBarModule],  // Import Angular and Material modules
  exports: [ProgressBarComponent]  // Export ProgressBarComponent so it can be used in other modules
})
export class ProgressBarModule {}
