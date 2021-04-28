import { DajareModel } from "./model";
import { DajareClient, SlackClient } from "./client";
import { DajareRepository, SlackChannelRepository } from "./repository";

declare const global: {
  [x: string]: any;
};

global.doGet = (): GoogleAppsScript.Content.TextOutput => {
  // create test object
  const dajareText = "布団が吹っ飛んだ";
  let dajare = new DajareModel(dajareText);
  dajare.setAuthor("山田 太郎");

  const dajareClient = new DajareClient();
  const slackClient = new SlackClient();
  const dajareRepository = new DajareRepository();
  const slackChannelRepository = new SlackChannelRepository();

  // judge
  dajare = dajareClient.judgeDajare(dajare);
  // eval
  dajare = dajareClient.evalDajare(dajare);

  // store dajare
  dajareRepository.store(dajare);

  // post message
  const slackChannel = slackChannelRepository.findByName("daas");
  if (slackChannel != undefined) {
    slackClient.postMessage(slackChannel, "こんにちは");
  }

  // make response
  ContentService.createTextOutput();
  const result = ContentService.createTextOutput();
  result.setContent(`${dajare.getText()}: ${dajare.getIsDajare().toString()}`);

  return result;
};

global.doPost = (e: any) => {
  const slackClient = new SlackClient();
  const params: any = JSON.parse(e.postData);

  // Slack Events API認証用
  if (params.type == "url_verification") {
    return ContentService.createTextOutput(params.challenge);
  }
};
