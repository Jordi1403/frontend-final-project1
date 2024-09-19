import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../shared/model/category';
import { CategoriesService } from '../services/categories.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ExitConfirmationDialogComponent } from '../exit-confirmation-dialog/exit-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./Trivia.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriviaComponent implements OnInit, OnDestroy {
  currentCategory?: Category;
  private routeSub?: Subscription;

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.routeSub = this.route.paramMap.subscribe(async (params) => {
      const id = params.get('categoryId');
      if (id) {
        this.currentCategory = await this.categoriesService.get(id);
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
