export class DajareModel {
  private text: string;
  private reading!: string;
  private isDajare!: boolean;
  private score!: number;
  private author!: string;

  constructor(text: string) {
    this.text = text;
  }

  setText(text: string): void {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }

  setReading(reading: string): void {
    this.reading = reading;
  }

  getReading(): string {
    return this.reading;
  }

  setIsDajare(isDajare: boolean): void {
    this.isDajare = isDajare;
  }

  getIsDajare(): boolean {
    return this.isDajare;
  }

  setScore(score: number): void {
    if (score >= 1.0 && score <= 5.0) {
      this.score = score;
    } else {
      throw new Error("score should be between 1 and 5.");
    }
  }

  getScore(): number {
    return this.score;
  }

  setAuthor(author: string): void {
    this.author = author;
  }

  getAuthor(): string {
    return this.author;
  }
}