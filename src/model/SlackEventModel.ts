export class SlackEventModel {
  private id!: string;
  private type!: string;
  private channelId!: string;
  private userId!: string;
  private message!: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getType(): string {
    return this.type;
  }

  setType(type: string): void {
    this.type = type;
  }

  getChannelId(): string {
    return this.channelId;
  }

  setChannelId(channelId: string): void {
    this.channelId = channelId;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getMessage(): string {
    return this.message;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  equals(slackEvent: SlackEventModel): boolean {
    return slackEvent.getId() == this.getId();
  }
}