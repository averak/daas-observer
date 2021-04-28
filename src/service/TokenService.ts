import { TOKEN_SHEET_NAME } from "../config";

export class TokenService {
  private sheet: GoogleAppsScript.Spreadsheet.Sheet | null;
  private SLACK_TOKEN: string;

  constructor() {
    const sheetApp = SpreadsheetApp.getActive();
    this.sheet = sheetApp.getSheetByName(TOKEN_SHEET_NAME);

    this.SLACK_TOKEN = this.sheet?.getRange("B2").getValue() as string;
  }

  getSlackToken(): string {
    return this.SLACK_TOKEN;
  }
}
