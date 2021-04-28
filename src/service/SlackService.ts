import { SlackChannelModel } from "../model";
import { SlackChannelRepository } from "../repository";
import { SlackClient } from "../client";

export class SlackService {
  private slackClient: SlackClient;
  private slackChannelRepository: SlackChannelRepository;

  constructor() {
    this.slackClient = new SlackClient();
    this.slackChannelRepository = new SlackChannelRepository();
  }

  postMessage(channelName: string, message: string): void {
    const channel:
      | SlackChannelModel
      | undefined = this.slackChannelRepository.findByName(channelName);

    // return if cannot post
    if (channel == undefined) {
      return;
    }
    if (!channel.getPostable()) {
      return;
    }

    // post
    this.slackClient.postMessage(channel, message);
  }
}
