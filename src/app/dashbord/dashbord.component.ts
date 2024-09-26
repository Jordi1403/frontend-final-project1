import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { CategoriesService } from '../services/categories.service';
import { GameResult } from '../../shared/model/game-result';
import { Category } from '../../shared/model/category';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon'; // If using mat-icon
import { MatProgressBarModule } from '@angular/material/progress-bar'; // If using mat-progress-bar

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
})
export class DashbordComponent implements OnInit {
  totalPoints: number = 0;
  totalGames: number = 0;
  highestAvgScoreGame: string = ''; // This will now show the most played game
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
  monthlyChallengeGoal: number = 20; // Number of games required for the monthly challenge
  challengeSteps: number[] = [];
  totalCategories: number = 0; // Will be updated after fetching the categories
  badges: string[] = []; // Array to store earned badges
  currentMonthYear: string = ''; // To track the current month and year
  allCategories: Category[] = []; // List of all categories
  categoryMap: { [key: string]: string } = {}; // Map from category ID to name

  // Add your gameMap here
  gameMap: { [key: string]: string } = {
    'some-game-id': 'Some Game Name',
    'mixed-words': 'Mixed Words',
    // Add more gameId mappings here
  };

  constructor(
    private gameService: GameService,
    private categoriesService: CategoriesService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const gameResults: GameResult[] = await this.gameService.list();
      console.log('Game Results:', gameResults); // Logging for debugging

      // Fetch categories using CategoriesService
      this.allCategories = await this.categoriesService.list();
      console.log('Categories:', this.allCategories); // Logging for debugging

      this.totalCategories = this.allCategories.length;

      // Create a map of categoryId to categoryName
      this.categoryMap = {};
      this.allCategories.forEach(category => {
        this.categoryMap[category.id] = category.name;
      });

      // Set current month and year
      const now = new Date();
      this.currentMonthYear = `${now.getMonth() + 1}-${now.getFullYear()}`;

      // Load badges (simulated via localStorage)
      this.loadBadges();

      // Calculate metrics
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
    let mostPlayedGameId = ''; // Variable to store the most played game ID
    let mostPlayedGameCount = 0; // Variable to track how many times the game was played

    for (const [gameId, games] of Object.entries(gamesGroupedByType)) {
      const avgScore = games.reduce((sum, game) => sum + game.points, 0) / games.length;
      console.log(`Game ID: ${gameId}, Average Score: ${avgScore}`); // Logging for debugging

      // Calculate highest and lowest average score
      if (avgScore > highestAvgScore) {
        highestAvgScore = avgScore;
        highestAvgScoreGameId = gameId;
      }

      if (avgScore < lowestAvgScore) {
        lowestAvgScore = avgScore;
        lowestAvgScoreGameId = gameId;
      }

      // Track perfect games
      games.forEach(game => {
        if (game.points === 100) {
          perfectGamesCount++;
        }

        // Track category count
        if (categoryCountMap[game.categoryId]) {
          categoryCountMap[game.categoryId]++;
        } else {
          categoryCountMap[game.categoryId] = 1;
        }
      });

      // Track the most played game
      if (games.length > mostPlayedGameCount) {
        mostPlayedGameCount = games.length;
        mostPlayedGameId = gameId;
      }
    }

    // Map gameId to game name using gameMap
    this.highestAvgScoreGame = this.gameMap[mostPlayedGameId] || mostPlayedGameId || 'N/A'; // Use mostPlayedGameId here
    this.lowestAvgScoreGame = this.gameMap[lowestAvgScoreGameId] || lowestAvgScoreGameId || 'N/A';

    // Calculate the percentage of perfect scores
    this.perfectScorePercentage = this.totalGames > 0 ? Math.round((perfectGamesCount / this.totalGames) * 100) : 0;

    // Get the most played category
    const mostPlayedCategoryId = Object.keys(categoryCountMap).reduce((a, b) =>
      categoryCountMap[a] > categoryCountMap[b] ? a : b, ''
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
    console.log('Games this month:', this.gamesThisMonth); // Logging for debugging

    if (this.gamesThisMonth >= this.monthlyChallengeGoal) {
      this.monthlyChallengeCompleted = true;

      // Check if badge for the current month is already added
      if (!this.badges.includes(this.currentMonthYear)) {
        this.badges.push(this.currentMonthYear);
        this.saveBadges(); // Save badges (in a real app, save to the database)
      }
    } else {
      this.gamesToCompleteChallenge = this.monthlyChallengeGoal - this.gamesThisMonth;
    }

    // Create challenge steps array
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
    console.log('Consecutive Days:', this.consecutiveDays); // Logging for debugging
  }

  groupBy(array: GameResult[], key: keyof GameResult): { [key: string]: GameResult[] } {
    return array.reduce((result: { [key: string]: GameResult[] }, currentValue: GameResult) => {
      const groupKey = currentValue[key] as string;
      (result[groupKey] = result[groupKey] || []).push(currentValue);
      return result;
    }, {});
  }

  loadBadges(): void {
    // In a real app, load badges from the user's profile in the database
    const badges = localStorage.getItem('badges');
    if (badges) {
      this.badges = JSON.parse(badges);
    }
  }

  saveBadges(): void {
    // In a real app, save badges to the user's profile in the database
    localStorage.setItem('badges', JSON.stringify(this.badges));
  }
}
