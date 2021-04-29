import { SlackUtil } from "./SlackUtil";
import { LOG_CHANNEL_NAME, LOG_SHEET_NAME } from "../config";

// load log sheet
const sheetApp = SpreadsheetApp.getActive();
const sheet = sheetApp.getSheetByName(LOG_SHEET_NAME);

export class LogUtil {
  static logging(
    message: string,
    level: "DEBUG" | "INFO" | "WARN" | "ERROR" = "INFO"
  ): void {
    if (level == "ERROR") {
      SlackUtil.postMessage(LOG_CHANNEL_NAME, `${level}: ${message}`);
    }
    sheet?.appendRow([new Date(), level, message]);
  }
}
