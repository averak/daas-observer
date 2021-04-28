import { DajareModel } from "./model";
import { DajareClient } from "./client";
import { DajareRepository } from "./repository";
import { SlackService } from "./service";

declare const global: {
  [x: string]: any;
};

global.doGet = (): GoogleAppsScript.Content.TextOutput => {
  // create test object
  const dajareText = "布団が吹っ飛んだ";
  let dajare = new DajareModel(dajareText);
  dajare.setAuthor("山田 太郎");

  const dajareClient = new DajareClient();
  const dajareRepository = new DajareRepository();
  const slackService = new SlackService();

  // judge
  dajare = dajareClient.judgeDajare(dajare);
  // eval
  dajare = dajareClient.evalDajare(dajare);

  // store dajare
  dajareRepository.store(dajare);

  // post message
  slackService.postMessage("daas", "daasへの投稿テストです");
  slackService.postMessage("bottest", "bottestへの投稿テストです");
  slackService.postMessage("not_exist", "投稿されません");

  // make response
  ContentService.createTextOutput();
  const result = ContentService.createTextOutput();
  result.setContent(`${dajare.getText()}: ${dajare.getIsDajare().toString()}`);

  return result;
};

interface postData {
  type: string;
  challenge: string;
  event: {
    type: string;
    channel: string;
    user: string;
    text: string;
  };
}

global.doPost = (event: GoogleAppsScript.Events.DoPost) => {
  const slackService = new SlackService();
  JSON.parse(event.postData.contents);
  const params: postData = JSON.parse(event.postData.contents) as postData;

  switch (params.type) {
    // Slack Events API verification
    case "url_verification":
      return ContentService.createTextOutput(params.challenge);
    // posted by user
    case "event_callback":
      slackService.receiveMessage(params.event.channel, params.event.text);
      break;
  }
};
