import { TOKEN_SHEET_NAME } from "./SheetConfig";

const sheetApp = SpreadsheetApp.getActive();
const sheet = sheetApp.getSheetByName(TOKEN_SHEET_NAME);

export const SLACK_OAUTH_TOKEN = sheet?.getRange("B2").getValue() as string;
