import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar'; 
import { ProgressBarComponent } from '../../app/progress-bar/progress-bar.component';



@NgModule({
  declarations: [ProgressBarComponent], 
  imports: [CommonModule, MatProgressBarModule],  
  exports: [ProgressBarComponent]  
})
export class ProgressBarModule {}
