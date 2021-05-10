import { SHEET_NAME } from "../config";

// load log sheet
const sheetApp = SpreadsheetApp.getActive();
const sheet = sheetApp.getSheetByName(SHEET_NAME.log);

export class LogUtil {
  static logging(
    message: string,
    level: "DEBUG" | "INFO" | "WARN" | "ERROR" = "INFO"
  ): void {
    sheet?.appendRow([new Date(), level, message]);
  }
}
