import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';  
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
 
@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.css'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriviaComponent implements OnInit, OnDestroy {
  currentCategory?: Category;
  private routeSub?: Subscription;
 
  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) {}
 
  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('categoryId')!, 10);  // Use 'categoryId' here
      if (!isNaN(id)) {
        this.currentCategory = this.categoriesService.get(id);
        if (!this.currentCategory) {
          console.error('Category not found for ID:', id);
        }
      } else {
        console.error('Invalid category ID:', params.get('categoryId'));
      }
    });
  }
 
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();  
  }
}
 