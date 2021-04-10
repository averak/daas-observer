import * as config from './config';

export function doGet(): GoogleAppsScript.Content.TextOutput {
  const dajare = '布団が吹っ飛んだ';
  const resData = JSON.stringify({
    is_dajare: judgeDajare(dajare)['is_dajare'],
    dajare: dajare,
    reading: getReading(dajare)['reading'],
    score: evalDajare(dajare)['score'],
  });

  ContentService.createTextOutput();
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(resData);

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
