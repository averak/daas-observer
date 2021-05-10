import {
  DajareModel,
  SlackChannelModel,
  AuthorModel,
  SlackEventModel,
} from "../model";
import { SlackChannelRepository, AuthorRepository } from "../repository";
import { DajareService } from "../service";
import { SlackClient } from "../client";
import { SLACK_CHANNELS, SLACK_REACTIONS } from "../config";
import { LogUtil, BuildMessageUtil } from "../util";

export class SlackService {
  private slackChannelRepository: SlackChannelRepository;
  private authorRepository: AuthorRepository;
  private slackClient: SlackClient;
  private dajareService: DajareService;

  constructor() {
    this.slackChannelRepository = new SlackChannelRepository();
    this.authorRepository = new AuthorRepository();
    this.slackClient = new SlackClient();
    this.dajareService = new DajareService();
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
      channel.getName() != SLACK_CHANNELS.daas &&
      channel.getName() != SLACK_CHANNELS.test
    ) {
      return true;
    }

    // author filtering
    const author: AuthorModel | undefined = this.authorRepository.findById(
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
    const author: AuthorModel | undefined = this.authorRepository.findById(
      slackEvent.getUserId()
    );
    if (author == undefined) {
      this.logging("cannot find author", "ERROR");
      return;
    }

    // create dajare object
    let dajare = new DajareModel(slackEvent.getMessage());
    dajare.setAuthorName(author.getName());
    // judge & eval
    dajare = this.dajareService.fetchInfo(dajare);

    // post message
    if (dajare.getIsDajare()) {
      const slackPreviewMessage = BuildMessageUtil.buildSlackPreview(dajare);
      this.slackClient.addReaction(slackEvent, SLACK_REACTIONS.thumbsup);
      this.postMessage(SLACK_CHANNELS.preview, slackPreviewMessage);
    } else {
      this.slackClient.addReaction(slackEvent, SLACK_REACTIONS.thumbsdown);
    }

    // store in sheet
    this.dajareService.store(dajare);
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

  logging(
    message: string,
    level: "DEBUG" | "INFO" | "WARN" | "ERROR" = "INFO"
  ): void {
    this.postMessage(SLACK_CHANNELS.log, `${level}: ${message}`);
    LogUtil.logging(message, level);
  }
}
