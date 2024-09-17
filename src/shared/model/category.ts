import { TranslatedWord } from './translated-word';

export class Category {
  constructor(
    public id: string,
    public name: string,
    public origin: string,
    public target: string,
    public words: TranslatedWord[] = [],   // Initialize the words array with an empty array by default
    public lastUpdateDate: Date = new Date()  // Initialize lastUpdateDate to the current date by default
  ) {}
}
