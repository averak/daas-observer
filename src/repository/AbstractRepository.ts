export abstract class AbstractRepository {
  protected sheet!: GoogleAppsScript.Spreadsheet.Sheet | null;

  constructor() {
    this.onInit();
  }

  abstract onInit(): void;

  protected loadSheet(sheetName: string): void {
    const sheetApp = SpreadsheetApp.getActive();
    this.sheet = sheetApp.getSheetByName(sheetName);
  }
}
