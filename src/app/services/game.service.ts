import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where, deleteDoc, doc, addDoc } from '@angular/fire/firestore';
import { GameResult } from '../../shared/model/game-result';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly collectionName = 'gameResults';

  constructor(private firestore: Firestore) {}

  async addGameResult(gameResult: GameResult): Promise<void> {
    try {
      const gameResultsCollection = collection(this.firestore, this.collectionName);
      await addDoc(gameResultsCollection, {
        categoryId: gameResult.categoryId,
        gameId: gameResult.gameId,
        date: gameResult.date,
        points: gameResult.points,
      });
    } catch (error) {
      console.error('Error adding game result: ', error);
    }
  }

  async list(): Promise<GameResult[]> {
    try {
      const gameResultsCollection = collection(this.firestore, this.collectionName);
      const querySnapshot = await getDocs(gameResultsCollection);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new GameResult(
          data['categoryId'],
          data['gameId'],
          data['date'].toDate(),  // Firestore stores dates as Timestamps, convert to Date
          data['points']
        );
      });
    } catch (error) {
      console.error('Error fetching game results: ', error);
      return [];
    }
  }

  // Add the deleteGameResultByGameId method here
  async deleteGameResultByGameId(gameId: string): Promise<void> {
    try {
      const gameResultsCollection = collection(this.firestore, this.collectionName);
      const q = query(gameResultsCollection, where('gameId', '==', gameId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref);
        console.log(`Game result with gameId ${gameId} deleted successfully`);
      });
    } catch (error) {
      console.error('Error deleting game result: ', error);
    }
  }
}
