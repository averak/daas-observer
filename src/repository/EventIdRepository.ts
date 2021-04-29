export class EventIdRepository {
  private idList: string[];

  constructor() {
    this.idList = [];
  }

  store(eventId: string): void {
    this.idList.push(eventId);
  }

  findAll(): string[] {
    return this.idList;
  }
}
