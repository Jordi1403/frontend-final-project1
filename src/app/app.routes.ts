import { Routes } from '@angular/router';
import { ChoseGameComponent } from './chose-game/chose-game.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { MixedLettersComponent } from './mixed-letters/mixed-letters.component';
import { TriviaComponent } from './Trivia/Trivia.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { HelpComponent } from './help/help.component';
import { SortWordsComponent } from './sort-words/sort-words.component';
import { GameCardComponent } from './game-card/game-card.component';
import { SummaryComponent } from './summary/summary.component';
import { MatchingWordsComponent } from './matching-words/matching-words.component';
import { TranslationAttackTimeComponent } from './translation-attack-time/translation-attack-time.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashbord', pathMatch: 'full' },
  { path: 'dashbord', component: DashbordComponent },
  { path: 'category/:id', component: CategoryFormComponent },
  { path: 'newcategory', component: CategoryFormComponent },
  { path: 'help', component: HelpComponent },
  { path: 'trivia/:categoryId', component: TriviaComponent },
  { path: 'mixed-letters/:id', component: MixedLettersComponent },
  { path: 'chose-game', component: ChoseGameComponent },
  { path: 'game/:gameName', component: GameCardComponent },
  { path: 'sort-words/:id', component: SortWordsComponent },
  { path: 'categories', component: CategoriesListComponent },
  { path: 'categories-list', component: CategoriesListComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'matching-words/:id', component: MatchingWordsComponent },
  { path: 'translation-attack-time/:id', component: TranslationAttackTimeComponent }, // Removed leading slash
];
