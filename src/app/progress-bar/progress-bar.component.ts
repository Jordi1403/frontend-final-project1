import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  @Input() current: number = 0;  // The current progress value
  @Input() total: number = 100;  // The total value for the progress bar

  get progress(): number {
    return (this.current / this.total) * 100;  // Calculate the progress percentage
  }
}
