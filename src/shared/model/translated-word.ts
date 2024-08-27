export class TranslatedWord {

    word(word: any): string {
      throw new Error('Method not implemented.');
    }
    guess:string;
    constructor(
        public origin : string,
        public target: string) 
        {
            this.guess=""
        }
}