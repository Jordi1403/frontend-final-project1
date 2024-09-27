export class TranslatedWord {
  public guess: string;

  constructor(
    public origin: string,   
    public target: string    
  ) {
    this.guess = '';         
  }
}
