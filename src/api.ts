import * as config from "./config";
import { Dajare, DajareRepository } from "./dajare";

export function doGet(): GoogleAppsScript.Content.TextOutput {
  const dajareText = "布団が吹っ飛んだ";
  const resData = JSON.stringify({
    is_dajare: judgeDajare(dajareText)["is_dajare"],
    dajare: dajareText,
    reading: getReading(dajareText)["reading"],
    score: evalDajare(dajareText)["score"],
  });

  ContentService.createTextOutput();
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(resData);

  const dajare: Dajare = new Dajare(dajareText);
  const dajareRepo: DajareRepository = new DajareRepository();
  dajareRepo.store(dajare);

  return output;
}

function judgeDajare(dajare: string): config.JudgeResponse {
  const res = UrlFetchApp.fetch(config.DAAS_JUDGE_URL(dajare));
  return JSON.parse(res.getContentText()) as config.JudgeResponse;
}

function evalDajare(dajare: string): config.EvalResponse {
  const res = UrlFetchApp.fetch(config.DAAS_EVAL_URL(dajare));
  return JSON.parse(res.getContentText()) as config.EvalResponse;
}

function getReading(dajare: string): config.ReadingResponse {
  const res = UrlFetchApp.fetch(config.DAAS_READING_URL(dajare));
  return JSON.parse(res.getContentText()) as config.ReadingResponse;
}
