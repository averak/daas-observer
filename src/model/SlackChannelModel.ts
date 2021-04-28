export class SlackChannelModel {
  private id!: string;
  private name!: string;
  private webhookURL!: string;

  constructor(id: string) {
    this.setID(id);
  }

  setID(id: string): void {
    if (id.length > 0) {
      this.id = id;
    }
  }

  getID(): string {
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

  setWebhookURL(webhookURL: string): void {
    const validRegex = RegExp(/https:\/\//);
    if (validRegex.exec(webhookURL) != null) {
      this.webhookURL = webhookURL;
    }
  }

  getWebhookURL(): string {
    return this.webhookURL;
  }
}
