import { ChoseGameComponent } from './chose-game/chose-game.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { MixedLettersComponent } from './mixed-letters/mixed-letters.component';
import { TriviaComponent } from './Trivia/Trivia.component';
import { Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { HelpComponent } from './help/help.component';
import { GameProfile } from '../shared/model/GameProfile';



export const routes: Routes = [
    {path: "dashbord", component: CategoriesListComponent},
    {path: "category/:id", component: CategoryFormComponent},
    {path: "newcategory", component: CategoryFormComponent},
    {path: "help", component: HelpComponent},
    {path: "trivia/:id", component: TriviaComponent},
    {path: "mixed-letters/:id", component: MixedLettersComponent},
    {path: "dashbord", component: DashbordComponent},
    {path: "chose-game", component: ChoseGameComponent},
    { path: 'game/:gameName', component: GameProfile },

];
