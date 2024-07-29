import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';

@Component({
  selector: 'app-sort-words',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sort-words.component.html',
  styleUrl: './sort-words.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortWordsComponent { 
@Input ()
id=''

currentCategory? : Category;

constructor(private categoriesService:CategoriesService){}

ngOnInit(): void {
  this.currentCategory = this.categoriesService.get(parseInt(this.id));
}
}