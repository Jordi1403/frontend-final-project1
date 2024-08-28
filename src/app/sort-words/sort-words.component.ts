import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-sort-words',
  templateUrl: './sort-words.component.html',
  styleUrls: ['./sort-words.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe], // Ensure DatePipe is available
})
export class SortWordsComponent implements OnInit {
  currentCategory?: Category;
  id?: number;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = +params.get('categoryId')!;
      this.currentCategory = this.categoriesService.get(this.id);
      if (!this.currentCategory) {
        console.error('Category not found for ID:', this.id);
      }
    });
  }
}
