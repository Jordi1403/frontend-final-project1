import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCategoryDialogComponent } from '../delete-category-dialog/delete-category-dialog.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,  
})
export class CategoriesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'numOfWords', 'lastUpdateDate', 'actions'];
  dataSource: Category[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private categoriesService: CategoriesService,
    private dialogService: MatDialog,
    private cdr: ChangeDetectorRef  
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      console.log('Fetching categories...');
      this.dataSource = await this.categoriesService.list();
      console.log('Fetched categories:', this.dataSource);  

      this.cdr.detectChanges();  
    } catch (error) {
      this.errorMessage = 'Error fetching categories. Please try again later.';
      console.error('Error fetching categories:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();  
    }
  }

  async deleteCategory(id: string, name: string): Promise<void> {
    const dialogRef = this.dialogService.open(DeleteCategoryDialogComponent, { data: name });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.categoriesService.delete(id);
          this.dataSource = this.dataSource.filter((category) => category.id !== id);
          this.cdr.detectChanges();  
        } catch (error) {
          this.errorMessage = 'Error deleting category. Please try again later.';
          console.error('Error deleting category:', error);
        }
      }
    });
  }
}
