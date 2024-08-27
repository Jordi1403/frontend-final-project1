import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
 
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  finalScore: number = 0;
 
  constructor(private route: ActivatedRoute, private router: Router) {}
 
  ngOnInit(): void {
    // Retrieve the score passed through the route
    this.finalScore = +this.route.snapshot.paramMap.get('score')!;
  }
 
  playAgain(): void {
    // Redirect to the game component to play again
    this.router.navigate(['/mixed-letters']);
  }
 
  chooseAnotherGame(): void {
    // Redirect to the choose-game page
    this.router.navigate(['/choose-game']);
  }
}
 