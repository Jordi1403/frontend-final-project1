import { CategoriesService } from './../services/categories.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Category } from '../../shared/model/category';

@Component({
  selector: 'app-mixed-letters',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mixed-letters.component.html',
  styleUrl: './mixed-letters.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixedLettersComponent implements OnInit{
    @Input ()
  id=''

  currentCategory? : Category;

  constructor(private categoriesService:CategoriesService){}
  
  ngOnInit(): void {
    this.currentCategory = this.categoriesService.get(parseInt(this.id));
  }
 }
