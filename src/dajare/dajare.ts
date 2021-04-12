export class Dajare {
  text: string;
  reading: string;
  isDajare: boolean;
  score: number;
  sensitiveTags: string[];
  isSensitive: boolean;
  author: string;

  constructor(text: string) {
    this.text = text;
    this.reading = '';
    this.isDajare = false;
    this.score = 0.0;
    this.sensitiveTags = [];
    this.isSensitive = false;
    this.author = '';
  }
}
