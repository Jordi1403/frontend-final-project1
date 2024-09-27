import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where, deleteDoc, doc, addDoc, CollectionReference } from '@angular/fire/firestore';
import { GameResult } from '../../shared/model/game-result';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import { collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly collectionName = 'gameResults';

  constructor(private firestore: Firestore) {}

  /**
   
   * @param gameResult התוצאה של המשחק להוספה.
   */
  async addGameResult(gameResult: GameResult): Promise<void> {
    try {
      const gameResultsCollection = collection(this.firestore, this.collectionName);
      await addDoc(gameResultsCollection, {
        categoryId: gameResult.categoryId,
        gameId: gameResult.gameId,
        date: gameResult.date instanceof Date ? gameResult.date : new Date(gameResult.date),
        points: gameResult.points,
      });
      console.log('Game result added successfully');
    } catch (error) {
      console.error('Error adding game result: ', error);
    }
  }

  /**
   * מחזיר Observable של תוצאות משחקים מ-Firestore בזמן אמת.
   * @returns Observable של מערך GameResult.
   */
  list(): Observable<GameResult[]> {
    const gameResultsCollection: CollectionReference = collection(this.firestore, this.collectionName);
    return collectionData(gameResultsCollection, { idField: 'id' }).pipe(
      map((data: any[]) => {
        console.log('Fetched data from Firestore:', data); // Debugging
        return data.map((doc) => {
          return new GameResult(
            doc.categoryId,
            doc.gameId,
            doc.date instanceof Timestamp ? doc.date.toDate() : new Date(doc.date),
            doc.points
          );
        });
      })
    );
  }

  /**
   * מוחק תוצאות משחק לפי gameId.
   * @param gameId 
   */
  async deleteGameResultByGameId(gameId: string): Promise<void> {
    try {
      const gameResultsCollection = collection(this.firestore, this.collectionName);
      const q = query(gameResultsCollection, where('gameId', '==', gameId));
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
      console.log(`Game result(s) with gameId ${gameId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting game result: ', error);
    }
  }
}
