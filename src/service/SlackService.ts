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
import { DiscordClient } from "../client";

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

      // FIXME: 一時的なテストです
      const discordClient = new DiscordClient();
      let icon_url: string;
      if (dajare.getScore() > 3.6) {
        icon_url =
          "https://conoha.mikumo.com/guideline/images/fanfic/fanfic_32.png";
      } else if (dajare.getScore() > 2.3) {
        icon_url =
          "https://conoha.mikumo.com/guideline/images/fanfic/fanfic_29.png";
      } else {
        icon_url =
          "https://conoha.mikumo.com/guideline/images/fanfic/fanfic_31.png";
      }
      discordClient.postMessage(slackPreviewMessage, icon_url);
    } else {
      SlackUtil.addReaction(slackEvent, THUMBSDOWN_REACTION_NAME);
    }

    // store in sheet
    this.dajareService.store(dajare);
  }
}
