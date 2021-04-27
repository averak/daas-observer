import { DajareModel } from "./model";
import { DajareClient } from "./client";
import { DajareRepository } from "./repository";

declare const global: {
  [x: string]: any;
};

// global.doGet = api.doGet;
global.doGet = (): GoogleAppsScript.Content.TextOutput => {
  // create test object
  const dajareText = "布団が吹っ飛んだ";
  let dajare = new DajareModel(dajareText);

  const dajareClient = new DajareClient();
  const dajareRepository = new DajareRepository();

  // judge
  dajare = dajareClient.judgeDajare(dajare);

  dajareRepository.store(dajare);

  ContentService.createTextOutput();
  const result = ContentService.createTextOutput();
  result.setContent(`${dajare.getText()}: ${dajare.getIsDajare().toString()}`);
  return result;
};
