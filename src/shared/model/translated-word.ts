export class TranslatedWord {
  public guess: string;

  constructor(
    public origin: string,   // The original word in the source language
    public target: string    // The translated word in the target language
  ) {
    this.guess = '';         // Initialize guess as an empty string
  }
}
