import { SlackUtil } from "./SlackUtil";
import { SLACK_CHANNELS, SHEET_NAME } from "../config";

// load log sheet
const sheetApp = SpreadsheetApp.getActive();
const sheet = sheetApp.getSheetByName(SHEET_NAME.log);

export class LogUtil {
  static logging(
    message: string,
    level: "DEBUG" | "INFO" | "WARN" | "ERROR" = "INFO"
  ): void {
    if (level == "ERROR") {
      SlackUtil.postMessage(SLACK_CHANNELS.log, `${level}: ${message}`);
    }
    sheet?.appendRow([new Date(), level, message]);
  }
}
