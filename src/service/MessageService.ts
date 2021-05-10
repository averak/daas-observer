import { DajareModel } from "../model";
import { SHEET_NAME } from "../config";

export class MessageService {
  private sheet: GoogleAppsScript.Spreadsheet.Sheet | null;
  private JUDGE_TWEET: string;
  private RANKING_TWEET: string;
  private SLACK_PREVIEW: string;
  private SLACK_WELCOME: string;

  constructor() {
    const sheetApp = SpreadsheetApp.getActive();
    this.sheet = sheetApp.getSheetByName(SHEET_NAME.post_config);

    this.JUDGE_TWEET = this.sheet?.getRange("B3").getValue() as string;
    this.RANKING_TWEET = this.sheet?.getRange("B10").getValue() as string;
    this.SLACK_PREVIEW = this.sheet?.getRange("B17").getValue() as string;
    this.SLACK_WELCOME = this.sheet?.getRange("D3").getValue() as string;
  }

  makeJudgeTweet(dajare: DajareModel): string {
    return this.fillPlaceholders(this.JUDGE_TWEET, dajare);
  }

  makeRankingTweet(dajare: DajareModel): string {
    return this.fillPlaceholders(this.RANKING_TWEET, dajare);
  }

  makeSlackPreview(dajare: DajareModel): string {
    return this.fillPlaceholders(this.SLACK_PREVIEW, dajare);
  }

  private fillPlaceholders(template: string, dajare: DajareModel): string {
    let result = template;
    const intScore = Math.round(dajare.getScore());

    result = result.replace("${timestamp}", new Date().toISOString());
    result = result.replace("${dajare_text}", dajare.getText());
    result = result.replace("${author}", dajare.getAuthorName());
    result = result.replace(
      "${dajare_star}",
      `${"★".repeat(intScore)}${"☆".repeat(5 - intScore)}`
    );
    result = result.replace("${dajare_score}", dajare.getScore().toFixed(2));

    return result;
  }
}
