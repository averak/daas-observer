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
import { SlackClient, TwitterClient } from "../client";
import { SLACK_CHANNELS, SLACK_REACTIONS } from "../config";
import { LogUtil, BuildMessageUtil } from "../util";

export class SlackService {
  private slackChannelRepository: SlackChannelRepository;
  private slackEventRepository: SlackEventRepository;
  private authorRepository: AuthorRepository;
  private slackClient: SlackClient;
  private twitterClient: TwitterClient;
  private dajareService: DajareService;

  constructor() {
    this.slackChannelRepository = new SlackChannelRepository();
    this.slackEventRepository = new SlackEventRepository();
    this.authorRepository = new AuthorRepository();
    this.slackClient = new SlackClient();
    this.twitterClient = new TwitterClient();
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
      this.postResult(slackEvent, dajare);
      this.slackClient.addReaction(slackEvent, SLACK_REACTIONS.thumbsup);
    } else {
      this.slackClient.addReaction(slackEvent, SLACK_REACTIONS.thumbsdown);
    }
  }

  receiveSlashCommand(slackEvent: SlackEventModel): void {
    // fetch author
    const author: AuthorModel | undefined = this.authorRepository.findById(
      slackEvent.getUserId()
    );
    if (author == undefined) {
      this.logging("cannot find author", "ERROR");
      return;
    }
    // received channel
    const channel = this.slackChannelRepository?.findById(
      slackEvent.getChannelId()
    );
    if (channel == undefined) {
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

    switch (slackEvent.getCommand()) {
      case "force":
        dajare.setIsDajare(true);
        this.postResult(slackEvent, dajare);
        this.postMessage(
          channel.getName(),
          `強制的に判定しました：${dajare.getText()}`
        );
        break;

      case "info":
        this.postMessage(
          channel.getName(),
          `text: ${dajare.getText()}\nscore: ${dajare.getScore()}\nreading: ${dajare.getReading()}`
        );
        break;

      case "reading":
        this.postMessage(channel.getName(), `reading: ${dajare.getReading()}`);
        break;

      default:
        break;
    }
  }

  private postResult(slackEvent: SlackEventModel, dajare: DajareModel): void {
    dajare = this.dajareService.preprocessing(dajare, "origin");
    // add reaction
    this.slackClient.addReaction(slackEvent, SLACK_REACTIONS.thumbsup);
    // build message
    const slackPreviewMessage = BuildMessageUtil.buildSlackPreview(dajare);
    const judgeTweetMessage = BuildMessageUtil.buildJudgeTweet(dajare);
    // post result
    this.postMessage(SLACK_CHANNELS.preview, slackPreviewMessage);
    this.twitterClient.postMessage(judgeTweetMessage);
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
