export class GameResult {
  constructor(
    public categoryId: string,
    public gameId: string,
    public date: Date,
    public points: number
  ) {}
}
