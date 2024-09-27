import { TranslatedWord } from './translated-word';

export class Category {
  constructor(
    public id: string,
    public name: string,
    public origin: string,
    public target: string,
    public words: TranslatedWord[] = [],   
    public lastUpdateDate: Date = new Date()  
  ) {}
}
