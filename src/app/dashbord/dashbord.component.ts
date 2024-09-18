import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { GameinfoService } from '../services/gameinfo.service'; // ייבוא של GameinfoService
import { GameResult } from '../../shared/model/game-result';
import { GameProfile } from '../../shared/model/GameProfile'; // ייבוא GameProfile

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
})
export class DashbordComponent implements OnInit {
  totalPoints: number = 0;
  totalGames: number = 0;
  highestAvgScoreGame: string = '';
  lowestAvgScoreGame: string = '';
  learnedCategoriesCount: number = 0;
  unlearnedCategoriesCount: number = 0;
  perfectScorePercentage: number = 0;
  mostPlayedCategory: string = '';
  learnedCategoriesPercentage: number = 0;

  allGames: GameProfile[] = []; // משתנה לאחסון כל המשחקים מהשירות

  constructor(
    private gameService: GameService,
    private gameInfoService: GameinfoService // שימוש בשירות לקבלת רשימת המשחקים
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const gameResults: GameResult[] = await this.gameService.list();
      console.log('Game results fetched:', gameResults);

      if (gameResults.length === 0) {
        console.log('No game results available.');
        return;
      }

      // קבלת כל המשחקים ושמירתם במשתנה
      this.allGames = this.gameInfoService.list();

      // כמות המשחקים וכמות הנקודות
      this.totalGames = gameResults.length;
      this.totalPoints = gameResults.reduce((sum, game) => sum + game.points, 0);

      // חישוב שאר המדדים
      this.calculateGameMetrics(gameResults);
    } catch (error) {
      console.error('Error fetching game results:', error);
    }
  }

  calculateGameMetrics(gameResults: GameResult[]): void {
    const gamesGroupedByType = this.groupBy(gameResults, 'gameId');
    
    let highestAvgScore = 0;
    let lowestAvgScore = Infinity;
    let highestAvgScoreGameId = '';
    let lowestAvgScoreGameId = '';
    const categoryCountMap: { [categoryId: string]: number } = {};
    let perfectGamesCount = 0;

    for (const [gameId, games] of Object.entries(gamesGroupedByType)) {
      const avgScore = games.reduce((sum, game) => sum + game.points, 0) / games.length;

      // עדכון המשחק עם הציון הממוצע הגבוה ביותר
      if (avgScore > highestAvgScore) {
        highestAvgScore = avgScore;
        highestAvgScoreGameId = gameId;
      }

      // עדכון המשחק עם הציון הממוצע הנמוך ביותר
      if (avgScore < lowestAvgScore) {
        lowestAvgScore = avgScore;
        lowestAvgScoreGameId = gameId;
      }

      // בדיקת משחקים עם תוצאה מושלמת
      games.forEach(game => {
        if (game.points === 100) {
          perfectGamesCount++;
        }

        // ספירה של משחקים לפי קטגוריה
        if (categoryCountMap[game.categoryId]) {
          categoryCountMap[game.categoryId]++;
        } else {
          categoryCountMap[game.categoryId] = 1;
        }
      });
    }

    // שימוש בשירות כדי לקבל את שם המשחק על פי ה-ID
    this.highestAvgScoreGame = this.getGameNameById(highestAvgScoreGameId);
    this.lowestAvgScoreGame = this.getGameNameById(lowestAvgScoreGameId);

    // חישוב אחוז משחקים עם ציון 100
    this.perfectScorePercentage = (perfectGamesCount / this.totalGames) * 100;

    // מציאת הקטגוריה ששוחקה הכי הרבה
    this.mostPlayedCategory = Object.keys(categoryCountMap).reduce((a, b) => 
      categoryCountMap[a] > categoryCountMap[b] ? a : b
    );

    // חישוב כמות הקטגוריות שנלמדו
    this.learnedCategoriesCount = Object.keys(categoryCountMap).length;

    // חישוב כמות הקטגוריות שלא נלמדו (נניח שיש 10 קטגוריות סך הכל)
    const totalCategories = 10;
    this.unlearnedCategoriesCount = totalCategories - this.learnedCategoriesCount;

    // חישוב אחוז הקטגוריות שנלמדו
    this.learnedCategoriesPercentage = (this.learnedCategoriesCount / totalCategories) * 100;
  }

  // פונקציה לקבלת שם המשחק לפי ה-ID מ-GameinfoService
  getGameNameById(gameId: string): string {
    const game = this.allGames.find(g => g.id.toString() === gameId);
    return game ? game.name : `Game ID: ${gameId}`;
  }

  groupBy(array: GameResult[], key: keyof GameResult): { [key: string]: GameResult[] } {
    return array.reduce((result: { [key: string]: GameResult[] }, currentValue: GameResult) => {
      const groupKey = currentValue[key] as string;
      (result[groupKey] = result[groupKey] || []).push(currentValue);
      return result;
    }, {});
  }
}
