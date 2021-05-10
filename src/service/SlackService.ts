import {
  DajareModel,
  SlackChannelModel,
  AuthorModel,
  SlackEventModel,
} from "../model";
import {
  SlackChannelRepository,
  SlackEventRepository,
  AuthorRepository,
} from "../repository";
import { DajareService } from "../service";
import { SlackClient } from "../client";
import { SLACK_CHANNELS, SLACK_REACTIONS } from "../config";
import { LogUtil, BuildMessageUtil } from "../util";

export class SlackService {
  private slackChannelRepository: SlackChannelRepository;
  private slackEventRepository: SlackEventRepository;
  private authorRepository: AuthorRepository;
  private slackClient: SlackClient;
  private dajareService: DajareService;

  constructor() {
    this.slackChannelRepository = new SlackChannelRepository();
    this.slackEventRepository = new SlackEventRepository();
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

    // ignore already received event
    if (this.slackEventRepository.exists(slackEvent)) {
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
    // store event
    this.slackEventRepository.store(slackEvent);

    // fetch author
    const author: AuthorModel | undefined = this.authorRepository.findById(
      slackEvent.getUserId()
    );
    if (author == undefined) {
      this.logging("cannot find author", "ERROR");
      return;
    }

    // create dajare object
    const dajare = new DajareModel(slackEvent.getMessage());
    dajare.setAuthorName(author.getName());
    dajare.setDate(new Date());
    // judge & eval
    try {
      const processed_dajare = this.dajareService.preprocessing(dajare, "kana");
      dajare.setIsDajare(this.dajareService.judgeDajare(processed_dajare));
      dajare.setScore(this.dajareService.evalDajare(processed_dajare));
      dajare.setReading(this.dajareService.readingDajare(processed_dajare));
    } catch (e) {
      this.logging("failed to connect DaaS", "ERROR");
      return;
    }

    // post message
    if (dajare.getIsDajare()) {
      const processed_dajare = this.dajareService.preprocessing(
        dajare,
        "origin"
      );
      // add reaction
      this.slackClient.addReaction(slackEvent, SLACK_REACTIONS.thumbsup);
      // post result
      const slackPreviewMessage = BuildMessageUtil.buildSlackPreview(
        processed_dajare
      );
      this.postMessage(SLACK_CHANNELS.preview, slackPreviewMessage);
      // store in sheet
      this.dajareService.store(processed_dajare);
    } else {
      // add reaction
      this.slackClient.addReaction(slackEvent, SLACK_REACTIONS.thumbsdown);
    }
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
