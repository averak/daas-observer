import { DajareModel, SlackChannelModel } from "../model";
import { SlackChannelRepository } from "../repository";
import { SlackClient } from "../client";
import { DajareService, MessageService } from "../service";

export class SlackService {
  private slackClient: SlackClient;
  private slackChannelRepository: SlackChannelRepository;
  private dajareService: DajareService;
  private messageService: MessageService;

  constructor() {
    this.slackClient = new SlackClient();
    this.slackChannelRepository = new SlackChannelRepository();
    this.dajareService = new DajareService();
    this.messageService = new MessageService();
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

    // judge & post
    let dajare = new DajareModel(message);
    dajare = this.dajareService.fetchInfo(dajare);
    const slackPreviewMessage = this.messageService.makeSlackPreview(dajare);
    this.postMessage("twitter", slackPreviewMessage);
    // store in sheet
    this.dajareService.store(dajare);
  }
}
