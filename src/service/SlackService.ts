import {
  DajareModel,
  SlackChannelModel,
  AuthorModel,
  SlackEventModel,
} from "../model";
import { SlackChannelRepository } from "../repository";
import { DajareService, MessageService, AuthorService } from "../service";
import {
  DAAS_CHANNEL_NAME,
  TEST_CHANNEL_NAME,
  PREVIEW_CHANNEL_NAME,
  THUMBSUP_REACTION_NAME,
  THUMBSDOWN_REACTION_NAME,
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

  slackEventFilter(slackEvent: SlackEventModel): boolean {
    // text filtering
    const regex = RegExp("ERROR");
    if (regex.exec(slackEvent.getMessage())) {
      return true;
    }

    // channel filtering
    const channel:
      | SlackChannelModel
      | undefined = this.slackChannelRepository.findById(
      slackEvent.getChannelId()
    );
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
      slackEvent.getUserId()
    );
    if (author == undefined) {
      return true;
    }
    if (author.getIsBot()) {
      return true;
    }

    return false;
  }

  receiveMessage(slackEvent: SlackEventModel): void {
    // fetch author
    const author: AuthorModel | undefined = this.authorService.findById(
      slackEvent.getUserId()
    );
    if (author == undefined) {
      LogUtil.logging("cannot find author", "ERROR");
      return;
    }

    // create dajare object
    let dajare = new DajareModel(slackEvent.getMessage());
    dajare.setAuthorName(author.getName());
    // judge & eval
    dajare = this.dajareService.fetchInfo(dajare);

    // post message
    if (dajare.getIsDajare()) {
      const slackPreviewMessage = this.messageService.makeSlackPreview(dajare);
      SlackUtil.addReaction(slackEvent, THUMBSUP_REACTION_NAME);
      SlackUtil.postMessage(PREVIEW_CHANNEL_NAME, slackPreviewMessage);
    } else {
      SlackUtil.addReaction(slackEvent, THUMBSDOWN_REACTION_NAME);
    }

    // store in sheet
    this.dajareService.store(dajare);
  }
}
