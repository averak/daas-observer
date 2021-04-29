import { DajareModel, SlackChannelModel, AuthorModel } from "../model";
import { SlackChannelRepository } from "../repository";
import { DajareService, MessageService, AuthorService } from "../service";
import {
  DAAS_CHANNEL_NAME,
  TEST_CHANNEL_NAME,
  PREVIEW_CHANNEL_NAME,
} from "../config";
import { SlackUtil, LogUtil } from "../util";

export class SlackService {
  private slackChannelRepository: SlackChannelRepository;
  private dajareService: DajareService;
  private messageService: MessageService;
  private authorService: AuthorService;

  constructor() {
    this.slackChannelRepository = new SlackChannelRepository();
    this.dajareService = new DajareService();
    this.messageService = new MessageService();
    this.authorService = new AuthorService();
  }

  receiveMessage(channelId: string, userId: string, message: string): void {
    const channel:
      | SlackChannelModel
      | undefined = this.slackChannelRepository.findById(channelId);

    // channel filtering
    if (channel == undefined) {
      return;
    }
    if (
      channel.getName() != DAAS_CHANNEL_NAME &&
      channel.getName() != TEST_CHANNEL_NAME
    ) {
      return;
    }

    // create dajare object
    let dajare = new DajareModel(message);
    // set author
    const author: AuthorModel | undefined = this.authorService.findById(userId);
    if (author == undefined) {
      LogUtil.logging("cannot find author", "ERROR");
      return;
    } else {
      dajare.setAuthor(author);
    }

    // bot filtering
    if (author.getIsBot()) {
      return;
    }

    // judge & eval
    dajare = this.dajareService.fetchInfo(dajare);

    // post message
    const slackPreviewMessage = this.messageService.makeSlackPreview(dajare);
    SlackUtil.postMessage(PREVIEW_CHANNEL_NAME, slackPreviewMessage);

    // store in sheet
    this.dajareService.store(dajare);
  }
}
