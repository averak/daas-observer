import {
  DajareModel,
  SlackChannelModel,
  AuthorModel,
  EventModel,
} from "../model";
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

  eventFilter(event: EventModel): boolean {
    // text filtering
    const regex = RegExp("ERROR");
    if (regex.exec(event.getMessage())) {
      return true;
    }

    // channel filtering
    const channel:
      | SlackChannelModel
      | undefined = this.slackChannelRepository.findById(event.getChannelId());
    if (channel == undefined) {
      return true;
    }
    if (
      channel.getName() != DAAS_CHANNEL_NAME &&
      channel.getName() != TEST_CHANNEL_NAME
    ) {
      return true;
    }

    // author filtering
    const author: AuthorModel | undefined = this.authorService.findById(
      event.getUserId()
    );
    if (author == undefined) {
      return true;
    }
    if (author.getIsBot()) {
      return true;
    }

    return false;
  }

  receiveMessage(event: EventModel): void {
    // fetch author
    const author: AuthorModel | undefined = this.authorService.findById(
      event.getUserId()
    );
    if (author == undefined) {
      LogUtil.logging("cannot find author", "ERROR");
      return;
    }

    // create dajare object
    let dajare = new DajareModel(event.getMessage());
    dajare.setAuthor(author);
    // judge & eval
    dajare = this.dajareService.fetchInfo(dajare);

    // post message
    const slackPreviewMessage = this.messageService.makeSlackPreview(dajare);
    SlackUtil.postMessage(PREVIEW_CHANNEL_NAME, slackPreviewMessage);

    // store in sheet
    this.dajareService.store(dajare);
  }
}
