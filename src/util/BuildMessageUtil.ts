import { DajareModel } from "../model";
import { SHEET_NAME } from "../config";

// load log sheet
const sheetApp = SpreadsheetApp.getActive();
const sheet = sheetApp.getSheetByName(SHEET_NAME.post_config);

// message templates
const TEMPLATES = {
  twitter_judge: sheet?.getRange("B3").getValue() as string,
  twitter_ranking: sheet?.getRange("B10").getValue() as string,
  slack_preview: sheet?.getRange("B17").getValue() as string,
  slack_welcome: sheet?.getRange("D3").getValue() as string,
};

export class BuildMessageUtil {
  static buildJudgeTweet(dajare: DajareModel): string {
    return BuildMessageUtil.fillPlaceholders(TEMPLATES.twitter_judge, dajare);
  }

  static buildRankingTweet(dajare: DajareModel): string {
    return BuildMessageUtil.fillPlaceholders(TEMPLATES.twitter_ranking, dajare);
  }

  static buildSlackPreview(dajare: DajareModel): string {
    return BuildMessageUtil.fillPlaceholders(TEMPLATES.slack_preview, dajare);
  }

  static buildSlackWelcome(dajare: DajareModel): string {
    return BuildMessageUtil.fillPlaceholders(TEMPLATES.slack_welcome, dajare);
  }

  private static fillPlaceholders(
    template: string,
    dajare: DajareModel
  ): string {
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
