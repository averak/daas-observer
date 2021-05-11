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

  static clearAll(): void {
    // range settings
    const START_COL = 1;
    const START_ROW = 2;
    const END_COL = 3;
    const END_ROW = sheet?.getLastRow() || START_ROW;

    sheet?.getRange(START_ROW, START_COL, END_ROW, END_COL).clearContent();
  }
}
