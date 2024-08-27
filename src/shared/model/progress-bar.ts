import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../../app/progress-bar/progress-bar.component';
;

@NgModule({
  declarations: [ProgressBarComponent],
  imports: [CommonModule],
  exports: [ProgressBarComponent]  // Export the component so it can be used in other modules
})
export class ProgressBarModule {}
