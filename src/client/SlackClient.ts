import { SlackChannelModel, SlackEventModel } from "../model";
import { TokenService } from "../service";

export class SlackClient {
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
  }

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

  addReaction(slackEvent: SlackEventModel, reactionName: string): void {
    try {
      UrlFetchApp.fetch("https://slack.com/api/reactions.add", {
        method: "post",
        contentType: "application/x-www-form-urlencoded",
        payload: {
          token: this.tokenService.getSlackToken(),
          channel: slackEvent.getChannelId(),
          name: reactionName,
          timestamp: slackEvent.getTimestamp(),
        },
      });
    } catch (e) {
      return;
    }
  }
}
