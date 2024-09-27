import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  @Input() current: number = 0;  
  @Input() total: number = 100; 

  get progress(): number {
    return (this.current / this.total) * 100;  
  }
}
