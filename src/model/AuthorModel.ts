export class AuthorModel {
  private name!: string;
  private id!: string;
  private isBot!: boolean;

  constructor(id: string) {
    this.setId(id);
    this.isBot = false;
  }

  setId(id: string): void {
    if (id.length > 0) {
      this.id = id;
    }
  }

  getId(): string {
    return this.id;
  }

  setName(name: string): void {
    if (name.length > 0) {
      this.name = name;
    }
  }

  getName(): string {
    return this.name;
  }

  setIsBot(isBot: boolean): void {
    this.isBot = isBot;
  }

  getIsBot(): boolean {
    return this.isBot;
  }
}
