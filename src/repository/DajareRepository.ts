import { DajareModel } from "../model";
import { DAJARE_SHEET_NAME } from "../config";

export class DajareRepository {
  private sheet;

  constructor() {
    const sheetApp = SpreadsheetApp.getActive();
    this.sheet = sheetApp.getSheetByName(DAJARE_SHEET_NAME);
  }

  public store(dajare: DajareModel): void {
    this.sheet?.appendRow([
      new Date(),
      dajare.getText(),
      dajare.getScore(),
      dajare.getIsDajare(),
      dajare.getAuthor(),
    ]);
  }
}
