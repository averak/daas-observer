import { SlackChannelModel, SlackEventModel } from "../model";
import { EnvService } from "../service";

export class SlackClient {
  private envService: EnvService;

  constructor() {
    this.envService = new EnvService();
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
          token: this.envService.getEnv("SLACK_TOKEN"),
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
