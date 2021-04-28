import { DajareModel, SlackChannelModel } from "../model";
import { SlackChannelRepository } from "../repository";
import { SlackClient } from "../client";
import { DajareService } from "../service";

export class SlackService {
  private slackClient: SlackClient;
  private slackChannelRepository: SlackChannelRepository;
  private dajareService: DajareService;

  constructor() {
    this.slackClient = new SlackClient();
    this.slackChannelRepository = new SlackChannelRepository();
    this.dajareService = new DajareService();
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

  receiveMessage(channelID: string, message: string): void {
    const channel:
      | SlackChannelModel
      | undefined = this.slackChannelRepository.findByID(channelID);

    // catch only posts on #daas / #bottest
    if (channel == undefined) {
      return;
    }
    if (channel.getName() != "daas" && channel.getName() != "bottest") {
      return;
    }

    // post
    const dajare = new DajareModel(message);
    this.postJudgeResult(this.dajareService.fetchInfo(dajare));
  }

  postJudgeResult(dajare: DajareModel): void {
    const message = `ダジャレ：${dajare.getText()}\n評価：${dajare.getScore()}`;
    this.postMessage("twitter", message);
  }
}
