import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-trivia',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './Trivia.component.html',
  styleUrl: './Trivia.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriviaComponent { 
  @Input()
  id=''

currentCategory? : Category;

constructor(private categoriesService:CategoriesService){}

ngOnInit(): void {
  this.currentCategory = this.categoriesService.get(parseInt(this.id));
}
}
