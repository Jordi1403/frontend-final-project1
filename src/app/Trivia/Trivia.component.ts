import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./Trivia.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriviaComponent implements OnInit, OnDestroy {
  currentCategory?: Category;
  loading = true;  // Loading state
  errorMessage: string | null = null;  // Error message state
  private routeSub?: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private cdr: ChangeDetectorRef  // Inject ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.routeSub = this.route.paramMap.subscribe(async (params) => {
      const id = params.get('categoryId');
      if (id) {
        try {
          this.currentCategory = await this.categoriesService.get(id);
          if (!this.currentCategory) {
            this.errorMessage = `Category not found for ID: ${id}`;
          }
        } catch (error) {
          this.errorMessage = 'Failed to load category data. Please try again.';
        } finally {
          this.loading = false;  // Stop loading after fetching the category
          this.cdr.detectChanges();  // Ensure the view is updated
        }
      } else {
        this.errorMessage = 'Invalid category ID provided.';
        this.loading = false;
        this.cdr.detectChanges();  // Ensure the view is updated
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  exitGame(): void {
    this.dialog
      .open(ExitConfirmationDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result === 'yes') {
          this.router.navigate(['/choose-game']);
        }
      });
  }
}
