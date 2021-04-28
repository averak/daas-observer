import { SlackChannelModel } from "../model";
import { SlackChannelRepository } from "../repository";
import { SlackClient } from "../client";
import { LOG_CHANNEL_NAME } from "../config";

const slackClient = new SlackClient();
const slackChannelRepository = new SlackChannelRepository();

export class SlackUtil {
  static postMessage(channelName: string, message: string): void {
    const channel:
      | SlackChannelModel
      | undefined = slackChannelRepository.findByName(channelName);

    // return if cannot post
    if (channel == undefined) {
      return;
    }
    if (!channel.getPostable()) {
      return;
    }

    // post
    slackClient.postMessage(channel, message);
  }

  static logging(logMessage: string): void {
    SlackUtil.postMessage(LOG_CHANNEL_NAME, logMessage);
  }
}
