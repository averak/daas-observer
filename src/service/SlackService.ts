import { DajareModel, SlackChannelModel, AuthorModel } from "../model";
import { SlackChannelRepository } from "../repository";
import { SlackClient } from "../client";
import { DajareService, MessageService, AuthorService } from "../service";

export class SlackService {
  private slackClient: SlackClient;
  private slackChannelRepository: SlackChannelRepository;
  private dajareService: DajareService;
  private messageService: MessageService;
  private authorService: AuthorService;

  constructor() {
    this.slackClient = new SlackClient();
    this.slackChannelRepository = new SlackChannelRepository();
    this.dajareService = new DajareService();
    this.messageService = new MessageService();
    this.authorService = new AuthorService();
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

  receiveMessage(channelId: string, userId: string, message: string): void {
    const channel:
      | SlackChannelModel
      | undefined = this.slackChannelRepository.findById(channelId);

    // create dajare object
    let dajare = new DajareModel(message);

    // set author
    const author: AuthorModel | undefined = this.authorService.findById(userId);
    if (author == undefined) {
      return;
    } else {
      dajare.setAuthor(author);
    }

    // channel filtering
    if (channel == undefined) {
      return;
    }
    if (
      channel.getName() != "personal:daas" &&
      channel.getName() != "personal:bottest"
    ) {
      return;
    }
    // bot filtering
    if (author != undefined) {
      if (author.getIsBot()) {
        return;
      }
    }

    // judge & eval
    dajare = this.dajareService.fetchInfo(dajare);

    // post message
    const slackPreviewMessage = this.messageService.makeSlackPreview(dajare);
    this.postMessage("personal:twitter", slackPreviewMessage);

    // store in sheet
    this.dajareService.store(dajare);
  }
}
