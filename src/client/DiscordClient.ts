import { EnvService } from "../service";

export class DiscordClient {
  private envService: EnvService;

  constructor() {
    this.envService = new EnvService();
  }

  postMessage(message: string, icon_url = ""): void {
    try {
      UrlFetchApp.fetch(this.envService.getEnv("DISCORD_WEBHOOK_URL"), {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({
          username: "DaaS",
          content: message,
          avatar_url: icon_url,
        }),
      });
    } catch (e) {
      return;
    }
  }
}
