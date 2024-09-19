import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { GameinfoService } from '../services/gameinfo.service';
import { CategoriesService } from '../services/categories.service';
import { GameResult } from '../../shared/model/game-result';
import { GameProfile } from '../../shared/model/GameProfile';
import { Category } from '../../shared/model/category';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';               // If using mat-icon
import { MatProgressBarModule } from '@angular/material/progress-bar'; // If using mat-progress-bar

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule, MatGridListModule,MatCardModule, MatIconModule,MatProgressBarModule],
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
})
export class DashbordComponent implements OnInit {
  totalPoints: number = 0;
  totalGames: number = 0;
  highestAvgScoreGame: string = '';
  lowestAvgScoreGame: string = '';
  perfectScorePercentage: number = 0;
  mostPlayedCategory: string = '';
  learnedCategoriesCount: number = 0;
  unlearnedCategoriesCount: number = 0;
  learnedCategoriesPercentage: number = 0;
  gamesThisMonth: number = 0;
  gamesToCompleteChallenge: number = 0;
  monthlyChallengeCompleted: boolean = false;
  consecutiveDays: number = 0;
  monthlyChallengeGoal: number = 20; // מספר המשחקים הנדרש לאתגר החודשי
  challengeSteps: number[] = [];
  totalCategories: number = 0; // נעדכן לאחר קבלת הקטגוריות
  badges: string[] = []; // מערך לשמירת התגים שהושגו
  currentMonthYear: string = ''; // כדי לעקוב אחר החודש והשנה הנוכחיים
  allCategories: Category[] = []; // רשימת כל הקטגוריות
  categoryMap: { [key: string]: string } = {}; // מפה של ID הקטגוריה לשמה

  constructor(
    private gameService: GameService,
    private categoriesService: CategoriesService // שימוש בשירות שלך
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const gameResults: GameResult[] = await this.gameService.list();

      // קבלת הקטגוריות באמצעות CategoriesService שלך
      this.allCategories = await this.categoriesService.list();
      this.totalCategories = this.allCategories.length;

      // יצירת מפה של ID הקטגוריה לשמה
      this.categoryMap = {};
      this.allCategories.forEach(category => {
        this.categoryMap[category.id] = category.name; // התאמה לשמות השדות שלך
      });

      // קביעת החודש והשנה הנוכחיים
      const now = new Date();
      this.currentMonthYear = `${now.getMonth() + 1}-${now.getFullYear()}`;

      // טעינת התגים (ביישום אמיתי, יש לטעון מהפרופיל של המשתמש בבסיס הנתונים)
      this.loadBadges();

      // חישוב המדדים
      this.calculateGameMetrics(gameResults);
      this.calculateMonthlyChallenge(gameResults);
      this.calculateConsecutiveDays(gameResults);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  calculateGameMetrics(gameResults: GameResult[]): void {
    this.totalPoints = gameResults.reduce((sum, game) => sum + game.points, 0);
    this.totalGames = gameResults.length;

    let highestAvgScore = -Infinity;
    let lowestAvgScore = Infinity;
    let highestAvgScoreGameId = '';
    let lowestAvgScoreGameId = '';
    const gamesGroupedByType = this.groupBy(gameResults, 'gameId');
    const categoryCountMap: { [categoryId: string]: number } = {};
    let perfectGamesCount = 0;

    for (const [gameId, games] of Object.entries(gamesGroupedByType)) {
      const avgScore = games.reduce((sum, game) => sum + game.points, 0) / games.length;

      if (avgScore > highestAvgScore) {
        highestAvgScore = avgScore;
        highestAvgScoreGameId = gameId;
      }

      if (avgScore < lowestAvgScore) {
        lowestAvgScore = avgScore;
        lowestAvgScoreGameId = gameId;
      }

      games.forEach(game => {
        if (game.points === 100) {
          perfectGamesCount++;
        }

        if (categoryCountMap[game.categoryId]) {
          categoryCountMap[game.categoryId]++;
        } else {
          categoryCountMap[game.categoryId] = 1;
        }
      });
    }

    // משתמשים ב-ID של המשחק כי אין לנו את השמות
    this.highestAvgScoreGame = highestAvgScoreGameId || 'N/A';
    this.lowestAvgScoreGame = lowestAvgScoreGameId || 'N/A';

    this.perfectScorePercentage = this.totalGames > 0 ? Math.round((perfectGamesCount / this.totalGames) * 100) : 0;

    // משתמשים בשם הקטגוריה מהמפה שיצרנו
    const mostPlayedCategoryId = Object.keys(categoryCountMap).reduce((a, b) =>
      categoryCountMap[a] > categoryCountMap[b] ? a : b,
      ''
    );
    this.mostPlayedCategory = this.categoryMap[mostPlayedCategoryId] || 'N/A';

    this.learnedCategoriesCount = Object.keys(categoryCountMap).length;

    this.unlearnedCategoriesCount = this.totalCategories - this.learnedCategoriesCount;

    this.learnedCategoriesPercentage =
      this.totalCategories > 0 ? Math.round((this.learnedCategoriesCount / this.totalCategories) * 100) : 0;
  }

  calculateMonthlyChallenge(gameResults: GameResult[]): void {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const gamesThisMonth = gameResults.filter(gameResult => {
      const gameDate = gameResult.date instanceof Date ? gameResult.date : new Date(gameResult.date);
      return gameDate >= firstDayOfMonth;
    });

    this.gamesThisMonth = gamesThisMonth.length;

    if (this.gamesThisMonth >= this.monthlyChallengeGoal) {
      this.monthlyChallengeCompleted = true;

      // בדיקה אם התג לחודש הנוכחי כבר נוסף
      if (!this.badges.includes(this.currentMonthYear)) {
        this.badges.push(this.currentMonthYear);
        this.saveBadges(); // שמירת התגים (ביישום אמיתי, יש לשמור בבסיס הנתונים)
      }
    } else {
      this.gamesToCompleteChallenge = this.monthlyChallengeGoal - this.gamesThisMonth;
    }

    // יצירת מערך הצעדים לאתגר
    this.challengeSteps = Array.from({ length: this.monthlyChallengeGoal }, (_, i) => i + 1);
  }

  calculateConsecutiveDays(gameResults: GameResult[]): void {
    const sortedGames = gameResults.sort((a, b) => b.date.getTime() - a.date.getTime());

    let consecutiveDays = 0;
    let currentDate = new Date();

    while (true) {
      const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

      const gamesOnDate = sortedGames.filter(gameResult => {
        const gameDate = gameResult.date;
        return gameDate >= startOfDay && gameDate < endOfDay;
      });

      if (gamesOnDate.length > 0) {
        consecutiveDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    this.consecutiveDays = consecutiveDays;
  }

  groupBy(array: GameResult[], key: keyof GameResult): { [key: string]: GameResult[] } {
    return array.reduce((result: { [key: string]: GameResult[] }, currentValue: GameResult) => {
      const groupKey = currentValue[key] as string;
      (result[groupKey] = result[groupKey] || []).push(currentValue);
      return result;
    }, {});
  }

  loadBadges(): void {
    // ביישום אמיתי, יש לטעון את התגים מהפרופיל של המשתמש בבסיס הנתונים
    // כאן, אנחנו מדמים זאת באמצעות localStorage
    const badges = localStorage.getItem('badges');
    if (badges) {
      this.badges = JSON.parse(badges);
    }
  }

  saveBadges(): void {
    // ביישום אמיתי, יש לשמור את התגים בפרופיל של המשתמש בבסיס הנתונים
    // כאן, אנחנו מדמים זאת באמצעות localStorage
    localStorage.setItem('badges', JSON.stringify(this.badges));
  }
}