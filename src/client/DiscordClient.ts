const DISCORD_WEBHOOK_URL = ""

export class DiscordClient {
  postMessage(message: string, icon_url = ""): void {
    try {
      UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
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
