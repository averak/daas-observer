import { DajareModel } from "../model";
import { POST_CONFIG_SHEET_NAME } from "../config";

export class MessageService {
  private sheet: GoogleAppsScript.Spreadsheet.Sheet | null;
  private JUDGE_TWEET: string;
  private RANKING_TWEET: string;
  private SLACK_PREVIEW: string;
  private SLACK_WELCOME: string;

  constructor() {
    const sheetApp = SpreadsheetApp.getActive();
    this.sheet = sheetApp.getSheetByName(POST_CONFIG_SHEET_NAME);

    this.JUDGE_TWEET = this.sheet?.getRange("B3").getValue() as string;
    this.RANKING_TWEET = this.sheet?.getRange("B10").getValue() as string;
    this.SLACK_PREVIEW = this.sheet?.getRange("B17").getValue() as string;
    this.SLACK_WELCOME = this.sheet?.getRange("D3").getValue() as string;
  }

  makeJudgeTweet(dajare: DajareModel): string {
    let result = this.JUDGE_TWEET;
    const intScore = Math.round(dajare.getScore());

    result = result.replace("${timestamp}", new Date().toISOString());
    result = result.replace("${dajare_text}", dajare.getText());
    result = result.replace("${author}", dajare.getAuthor());
    result = result.replace(
      "${dajare_star}",
      `${"★".repeat(intScore)}${"☆".repeat(5 - intScore)}`
    );

    return result;
  }

  makeRankingTweet(dajare: DajareModel): string {
    let result = this.RANKING_TWEET;
    const intScore = Math.round(dajare.getScore());

    result = result.replace("${timestamp}", new Date().toISOString());
    result = result.replace("${dajare_text}", dajare.getText());
    result = result.replace("${author}", dajare.getAuthor());
    result = result.replace(
      "${dajare_star}",
      `${"★".repeat(intScore)}${"☆".repeat(5 - intScore)}`
    );
    result = result.replace("${dajare_score}", dajare.getScore().toFixed(2));

    return result;
  }

  makeSlackPreview(dajare: DajareModel): string {
    let result = this.SLACK_PREVIEW;
    const intScore = Math.round(dajare.getScore());

    result = result.replace("${timestamp}", new Date().toISOString());
    result = result.replace("${dajare_text}", dajare.getText());
    result = result.replace("${author}", dajare.getAuthor());
    result = result.replace(
      "${dajare_star}",
      `${"★".repeat(intScore)}${"☆".repeat(5 - intScore)}`
    );

    return result;
  }
}
