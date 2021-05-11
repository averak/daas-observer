export class SlackEventModel {
  private id!: string;
  private type!: string;
  private channelId!: string;
  private userId!: string;
  private message!: string;
  private command!: string;
  private timestamp!: string;

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

  getCommand(): string {
    return this.command;
  }

  setCommand(command: string): void {
    this.command = command;
  }

  getTimestamp(): string {
    return this.timestamp;
  }

  setTimestamp(timestamp: string): void {
    this.timestamp = timestamp;
  }

  equals(slackEvent: SlackEventModel): boolean {
    return slackEvent.getId() == this.getId();
  }
}
