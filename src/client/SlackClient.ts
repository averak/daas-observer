import { SlackChannelModel } from "../model";

export class SlackClient {
  postMessage(channel: SlackChannelModel, message: string): void {
    try {
      UrlFetchApp.fetch(channel.getWebhookURL(), {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({ text: message }),
      });
    } catch (e) {
      return;
    }
  }
}
